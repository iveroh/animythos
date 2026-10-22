import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface NeonGridProps {
  /** How fast the grid rolls toward the viewer. */
  speed?: number;
  /** Colour of the sky at the top of the screen. */
  skyColor?: string;
  /** Colour of the sun and horizon glow. */
  glowColor?: string;
  /** Colour of the grid lines. */
  gridColor?: string;
  className?: string;
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Draw directly in clip space so the quad always fills the viewport.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uPointer;

  uniform vec3 uSky;
  uniform vec3 uGlow;
  uniform vec3 uGrid;

  varying vec2 vUv;

  const float HORIZON = 0.42;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  vec3 sky(vec2 uv) {
    float h = clamp((uv.y - HORIZON) / (1.0 - HORIZON), 0.0, 1.0);
    vec3 color = mix(uGlow * 0.6, uSky, pow(h, 0.45));

    // Faint round stars in the upper sky.
    vec2 starUv = uv * vec2(uAspect, 1.0) * 70.0;
    vec2 cell = floor(starUv);
    vec2 offset = vec2(hash(cell + 1.0), hash(cell + 2.0)) * 0.6 + 0.2;
    float starDist = length(fract(starUv) - offset);
    float star = step(0.9, hash(cell)) * smoothstep(0.12, 0.0, starDist) * smoothstep(0.3, 0.9, h);
    color += star * (0.55 + 0.45 * sin(uTime * 2.0 + hash(cell + 3.0) * 6.28));

    // Sun with banded cut-outs in its lower half.
    float radius = 0.15;
    vec2 sp = vec2((uv.x - 0.5 + uPointer.x * 0.02) * uAspect, uv.y - (HORIZON + 0.14));
    float r = length(sp);

    float lower = clamp(-sp.y / radius, 0.0, 1.0);
    float gap = step(1.0 - lower * 1.4, sin(sp.y * 95.0 + uTime * 0.6));
    float sun = smoothstep(radius, radius - 0.004, r) * (1.0 - gap);

    vec3 sunColor = mix(vec3(1.0, 0.92, 0.45), uGlow, clamp(0.5 - sp.y / radius * 0.5, 0.0, 1.0));
    color += uGlow * 0.55 * exp(-r * 4.5);
    color = mix(color, sunColor, sun);

    return color;
  }

  vec3 floorColor(vec2 uv) {
    float y = HORIZON - uv.y;

    // Project the screen onto a ground plane.
    float z = 1.0 / max(y, 0.0001);
    float x = (uv.x - 0.5) * uAspect * z + uPointer.x * 0.07 * z;

    vec2 g = vec2(x, z + uTime) * 1.3;
    vec2 d = 0.5 - abs(fract(g) - 0.5);
    vec2 w = fwidth(g);

    vec2 line = 1.0 - smoothstep(vec2(0.0), w * 1.6, d);
    vec2 glow = exp(-d / (w * 5.0 + 0.0001)) * 0.18;

    // Lines dissolve into the horizon glow.
    float fade = smoothstep(0.0, 0.14, y);
    float strength = clamp(max(line.x, line.y) + glow.x + glow.y, 0.0, 1.0) * fade;

    vec3 base = mix(uGlow * 0.5, uSky * 0.35, smoothstep(0.0, 0.35, y));
    return base + uGrid * strength * 1.3;
  }

  void main() {
    vec3 color = vUv.y > HORIZON ? sky(vUv) : floorColor(vUv);

    // Bright horizon line.
    color += uGlow * exp(-abs(vUv.y - HORIZON) * 90.0) * 0.8;

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
  }
`;

function NeonGridScene({
  speed,
  skyColor,
  glowColor,
  gridColor,
}: Required<Omit<NeonGridProps, "className">>) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedTime = useRef(0);
  const targetPointer = useRef(new THREE.Vector2());
  const smoothPointer = useRef(new THREE.Vector2());

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uPointer: { value: new THREE.Vector2() },
      uSky: { value: new THREE.Color(skyColor) },
      uGlow: { value: new THREE.Color(glowColor) },
      uGrid: { value: new THREE.Color(gridColor) },
    }),
    [skyColor, glowColor, gridColor],
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

  useFrame((state, delta) => {
    elapsedTime.current += delta;

    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value = elapsedTime.current * speed;
    material.uniforms.uAspect.value = state.size.width / state.size.height;

    smoothPointer.current.lerp(
      targetPointer.current,
      1 - Math.exp(-delta * 2.5),
    );
    material.uniforms.uPointer.value.copy(smoothPointer.current);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Retro synthwave sunset with an endless neon grid. Fills its nearest
 * positioned parent (the parent needs `position: relative`).
 */
function NeonGrid({
  speed = 0.6,
  skyColor = "#07011a",
  glowColor = "#ff2fa8",
  gridColor = "#22d3ee",
  className,
}: NeonGridProps) {
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
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <NeonGridScene
          speed={speed}
          skyColor={skyColor}
          glowColor={glowColor}
          gridColor={gridColor}
        />
      </Canvas>
    </div>
  );
}

export default NeonGrid;
