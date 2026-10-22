import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface TopographyProps {
  /** How fast the terrain evolves. */
  speed?: number;
  /** Number of contour levels across the terrain. */
  levels?: number;
  /** Zoom of the terrain. Higher values give smaller, busier features. */
  scale?: number;
  /** Colour of the contour lines. */
  lineColor?: string;
  /** Background colour. */
  backgroundColor?: string;
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
  uniform float uLevels;
  uniform float uScale;
  uniform vec2 uPointer;

  uniform vec3 uLine;
  uniform vec3 uBackground;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(5.2, 1.3);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);

    // The cursor raises a hill under it.
    vec2 pointer = uPointer * 0.5 * vec2(uAspect, 1.0);
    float hill = exp(-dot(p - pointer, p - pointer) * 9.0) * 0.22;

    // Warp the sample position so the contours flow instead of just fading.
    vec2 q = p * uScale;
    vec2 warp = vec2(
      fbm(q + vec2(0.0, uTime * 0.6)),
      fbm(q + vec2(5.2, -uTime * 0.5))
    );
    float height = fbm(q + warp * 1.4 + uTime * 0.15) + hill;

    float v = height * uLevels;
    float w = max(fwidth(v), 0.0001);

    float dist = abs(fract(v + 0.5) - 0.5);
    float line = 1.0 - smoothstep(0.0, w * 1.3, dist);

    // Every fifth contour is an index line, drawn thicker and brighter.
    float level = floor(v + 0.5);
    float isIndex = step(mod(level, 5.0), 0.5);
    float indexLine = 1.0 - smoothstep(0.0, w * 2.4, dist);
    float strength = mix(line * 0.5, indexLine, isIndex);

    vec3 color = uBackground + uLine * 0.05 * smoothstep(0.2, 0.8, height);
    color = mix(color, uLine, strength);

    // Calm the centre so overlaid text stays readable, and fade the edges.
    float centerCalm = mix(0.45, 1.0, smoothstep(0.08, 0.45, length((vUv - 0.5) * vec2(1.0, 1.6))));
    float vignette = smoothstep(1.05, 0.25, length((vUv - 0.5) * vec2(1.3, 1.0)));
    color = mix(uBackground, color, (0.35 + 0.65 * vignette) * centerCalm);

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
  }
`;

function TopographyScene({
  speed,
  levels,
  scale,
  lineColor,
  backgroundColor,
}: Required<Omit<TopographyProps, "className">>) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedTime = useRef(0);
  const targetPointer = useRef(new THREE.Vector2());
  const smoothPointer = useRef(new THREE.Vector2());

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uLevels: { value: levels },
      uScale: { value: scale },
      uPointer: { value: new THREE.Vector2() },
      uLine: { value: new THREE.Color(lineColor) },
      uBackground: { value: new THREE.Color(backgroundColor) },
    }),
    [levels, scale, lineColor, backgroundColor],
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

    material.uniforms.uTime.value = elapsedTime.current * speed * 0.2;
    material.uniforms.uAspect.value = state.size.width / state.size.height;

    smoothPointer.current.lerp(
      targetPointer.current,
      1 - Math.exp(-delta * 4),
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
 * Slowly evolving topographic contour map. Fills its nearest positioned
 * parent (the parent needs `position: relative`).
 */
function Topography({
  speed = 1,
  levels = 14,
  scale = 2.2,
  lineColor = "#34d399",
  backgroundColor = "#03120d",
  className,
}: TopographyProps) {
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
        <TopographyScene
          speed={speed}
          levels={levels}
          scale={scale}
          lineColor={lineColor}
          backgroundColor={backgroundColor}
        />
      </Canvas>
    </div>
  );
}

export default Topography;
