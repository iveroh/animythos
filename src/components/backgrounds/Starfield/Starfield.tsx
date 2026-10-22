import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface StarfieldProps {
  /** Number of stars. */
  count?: number;
  /** Speed the stars drift toward the viewer. Use 0 for a still sky. */
  speed?: number;
  /** Star size multiplier. */
  size?: number;
  /** Colour of the first half of the stars. */
  colorA?: string;
  /** Colour of the second half of the stars. */
  colorB?: string;
  /** CSS background behind the stars. */
  background?: string;
  className?: string;
}

const DEPTH = 50;
const SPREAD_X = 36;
const SPREAD_Y = 24;

// Small seeded generator so the star layout is stable between renders.
function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uDepth;

  attribute float aScale;
  attribute float aPhase;
  attribute float aMix;

  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;

    // Travel toward the camera and wrap around so the field never runs out.
    p.z = -uDepth + mod(position.z + uTime * uSpeed, uDepth);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;

    float twinkle = 0.6 + 0.4 * sin(uTime * 1.6 + aPhase);
    float fadeIn = 1.0 - smoothstep(uDepth * 0.65, uDepth, dist);
    float fadeOut = smoothstep(0.5, 4.0, dist);

    vAlpha = twinkle * fadeIn * fadeOut;
    vMix = aMix;

    gl_PointSize = clamp(uSize * aScale * uPixelRatio * (130.0 / max(dist, 0.1)), 1.5, 28.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vAlpha;
  varying float vMix;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = pow(smoothstep(0.5, 0.0, d), 1.8);

    gl_FragColor = vec4(mix(uColorA, uColorB, vMix), glow * vAlpha);

    #include <colorspace_fragment>
  }
`;

function StarfieldScene({
  count,
  speed,
  size,
  colorA,
  colorB,
}: Required<Omit<StarfieldProps, "className" | "background">>) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedTime = useRef(0);
  const targetPointer = useRef(new THREE.Vector2());
  const smoothPointer = useRef(new THREE.Vector2());

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const mixes = new Float32Array(count);
    const random = createRandom(1337);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * 2 * SPREAD_X;
      positions[i * 3 + 1] = (random() - 0.5) * 2 * SPREAD_Y;
      positions[i * 3 + 2] = random() * DEPTH;

      scales[i] = 0.4 + Math.pow(random(), 3) * 2.2;
      phases[i] = random() * Math.PI * 2;
      mixes[i] = random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aMix", new THREE.BufferAttribute(mixes, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 0 },
      uSize: { value: size },
      uDepth: { value: DEPTH },
      uPixelRatio: { value: 1 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    [size, colorA, colorB],
  );

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      targetPointer.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    elapsedTime.current += delta;

    const material = materialRef.current;
    if (material) {
      material.uniforms.uTime.value = elapsedTime.current;
      material.uniforms.uSpeed.value = speed;
      material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    }

    // Gentle parallax that follows the pointer.
    smoothPointer.current.lerp(
      targetPointer.current,
      1 - Math.exp(-delta * 2),
    );

    if (pointsRef.current) {
      pointsRef.current.rotation.y = smoothPointer.current.x * 0.08;
      pointsRef.current.rotation.x = -smoothPointer.current.y * 0.05;
      pointsRef.current.rotation.z = elapsedTime.current * 0.004;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Twinkling stars drifting toward the viewer. Fills its nearest positioned
 * parent (the parent needs `position: relative`).
 */
function Starfield({
  count = 2500,
  speed = 2,
  size = 1,
  colorA = "#ffffff",
  colorB = "#8ab4ff",
  background = "radial-gradient(ellipse at 50% 120%, #1b1147 0%, #05010f 60%)",
  className,
}: StarfieldProps) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 0], fov: 60, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: false }}
      >
        <StarfieldScene
          count={count}
          speed={speed}
          size={size}
          colorA={colorA}
          colorB={colorB}
        />
      </Canvas>
    </div>
  );
}

export default Starfield;
