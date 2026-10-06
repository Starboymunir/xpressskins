"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture, OrbitControls, Environment, ContactShadows, MeshReflectorMaterial, Lightformer, useProgress } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type Coverage = "full" | "half" | "sides" | "hood";
export type FinishId = "gloss" | "matte" | "satin";
export type ViewId = "front" | "side" | "rear" | "top" | "free";

export const LIVERIES = [
  { id: "sakura", name: "Sakura Drift", src: "/liveries/sakura.jpg", swatch: "#ff8fcf" },
  { id: "neon", name: "Neon District", src: "/liveries/neon.jpg", swatch: "#1ee3ff" },
  { id: "shrine", name: "Shrine Tide", src: "/liveries/shrine.jpg", swatch: "#2b3a8f" },
  { id: "ronin", name: "Crimson Ronin", src: "/liveries/ronin.jpg", swatch: "#c81e2b" },
];

export const PAINTS = [
  { id: "pearl", name: "Pearl white", hex: "#eef0f2" },
  { id: "jet", name: "Jet black", hex: "#0b0b0d" },
  { id: "nardo", name: "Nardo grey", hex: "#8e9196" },
  { id: "gunmetal", name: "Gunmetal", hex: "#3a3d44" },
  { id: "midnight", name: "Midnight blue", hex: "#15224d" },
  { id: "candy", name: "Candy red", hex: "#b4122b" },
  { id: "sakura", name: "Sakura pink", hex: "#f2a6c9" },
  { id: "lime", name: "Acid lime", hex: "#b7f03a" },
];

interface SceneProps {
  color: string;
  livery: string;
  coverage: Coverage;
  finish: FinishId;
  view: ViewId;
  autoRotate: boolean;
}

const MODEL = "/models/ferrari.glb";
const VIEWS: Record<Exclude<ViewId, "free">, [number, number, number]> = {
  front: [-5.2, 1.6, -5.6],
  side: [8.2, 1.3, 0.01],
  rear: [5.2, 1.6, 5.6],
  top: [0.01, 10.5, 0.01],
};

/* ── Body material with object-space livery projection ── */
function useBodyMaterial() {
  const uniforms = useMemo(
    () => ({
      uArt: { value: null as THREE.Texture | null },
      uColor: { value: new THREE.Color("#eef0f2") },
      uSide: { value: 1 },
      uTop: { value: 1 },
      uHalf: { value: 0 },
      uEnds: { value: 1 },
      uBounds: { value: new THREE.Vector4(0, 1, 0, 1) }, // minZ, lenZ, minY, lenY
      uWidth: { value: new THREE.Vector2(0, 1) }, // minX, lenX
    }),
    [],
  );
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.04 });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vObjPos;\nvarying vec3 vObjNrm;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjPos = position;\nvObjNrm = normal;");
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
varying vec3 vObjPos; varying vec3 vObjNrm;
uniform sampler2D uArt; uniform vec3 uColor; uniform float uSide; uniform float uTop; uniform float uHalf; uniform float uEnds; uniform vec4 uBounds; uniform vec2 uWidth;`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
{
  vec3 n = normalize(vObjNrm);
  float sideW = smoothstep(0.30, 0.62, abs(n.x));
  float topW = smoothstep(0.30, 0.62, n.y);
  float endW = smoothstep(0.30, 0.62, abs(n.z)) * (1.0 - topW);
  float u = (vObjPos.z - uBounds.x) / uBounds.y;
  float v = (vObjPos.y - uBounds.z) / uBounds.w;
  u = n.x > 0.0 ? 1.0 - u : u;
  vec3 sideCol = texture2D(uArt, vec2(clamp(u, 0.0, 1.0), clamp(v * 1.15, 0.0, 1.0))).rgb;
  float ut = (vObjPos.z - uBounds.x) / uBounds.y;
  float vt = (vObjPos.x - uWidth.x) / uWidth.y;
  vec3 topCol = texture2D(uArt, vec2(clamp(1.0 - ut, 0.0, 1.0), clamp(vt, 0.0, 1.0))).rgb;
  float halfMask = uHalf > 0.5 ? step(vObjPos.x, 0.0) : 1.0;
  float ue = (vObjPos.x - uWidth.x) / uWidth.y;
  vec3 endCol = texture2D(uArt, vec2(clamp(n.z > 0.0 ? ue : 1.0 - ue, 0.0, 1.0), clamp(v * 1.15, 0.0, 1.0))).rgb;
  float m = max(max(sideW * uSide * halfMask, topW * uTop), endW * uEnds);
  float tot = sideW + topW + endW + 1e-4;
  vec3 wrap = (sideCol * sideW + topCol * topW + endCol * endW) / tot;
  diffuseColor.rgb = mix(uColor, wrap, m);
}`,
        );
    };
    m.customProgramCacheKey = () => "xs-livery";
    return m;
  }, [uniforms]);
  return { material, uniforms };
}

function Car({ color, livery, coverage, finish }: Omit<SceneProps, "view" | "autoRotate">) {
  const { scene } = useGLTF(MODEL);
  const art = useTexture(LIVERIES.find((l) => l.id === livery)?.src ?? LIVERIES[0].src);
  const { material, uniforms } = useBodyMaterial();
  const ready = useRef(false);

  useEffect(() => {
    art.colorSpace = THREE.SRGBColorSpace;
    art.wrapS = art.wrapT = THREE.ClampToEdgeWrapping;
    art.anisotropy = 8;
    uniforms.uArt.value = art;
  }, [art, uniforms]);

  useEffect(() => {
    if (ready.current) return;
    ready.current = true;
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const mat = mesh.material as THREE.Material;
      if (mat?.name === "Body_Color") {
        mesh.material = material;
        mesh.geometry.computeBoundingBox();
        const b = mesh.geometry.boundingBox!;
        uniforms.uBounds.value.set(b.min.z, b.max.z - b.min.z, b.min.y, b.max.y - b.min.y);
        uniforms.uWidth.value.set(b.min.x, b.max.x - b.min.x);
      } else if (mat?.name === "Glass_Gray") {
        mesh.material = new THREE.MeshPhysicalMaterial({ color: 0x0b1116, metalness: 0.1, roughness: 0.05, transmission: 0.35, transparent: true, opacity: 0.85, clearcoat: 1 });
      } else if (mat?.name === "metal_chrome") {
        (mat as THREE.MeshStandardMaterial).metalness = 1;
        (mat as THREE.MeshStandardMaterial).roughness = 0.15;
      }
    });
  }, [scene, material, uniforms]);

  useEffect(() => { uniforms.uColor.value.set(color); }, [color, uniforms]);
  useEffect(() => {
    uniforms.uSide.value = coverage === "full" || coverage === "half" || coverage === "sides" ? 1 : 0;
    uniforms.uTop.value = coverage === "full" || coverage === "half" || coverage === "hood" ? 1 : 0;
    uniforms.uHalf.value = coverage === "half" ? 1 : 0;
    uniforms.uEnds.value = coverage === "full" ? 1 : 0;
  }, [coverage, uniforms]);
  useEffect(() => {
    if (finish === "gloss") { material.roughness = 0.16; material.clearcoat = 1; material.clearcoatRoughness = 0.04; material.metalness = 0.25; }
    else if (finish === "satin") { material.roughness = 0.42; material.clearcoat = 0.35; material.clearcoatRoughness = 0.3; material.metalness = 0.2; }
    else { material.roughness = 0.85; material.clearcoat = 0.02; material.clearcoatRoughness = 0.8; material.metalness = 0.05; }
  }, [finish, material]);

  return <primitive object={scene} />;
}

function CameraRig({ view, controls }: { view: ViewId; controls: React.RefObject<OrbitControlsImpl | null> }) {
  const { camera } = useThree();
  const target = useRef<THREE.Vector3 | null>(null);
  useEffect(() => {
    if (view === "free") return;
    target.current = new THREE.Vector3(...VIEWS[view]);
  }, [view]);
  useFrame((_, dt) => {
    if (!target.current) return;
    camera.position.lerp(target.current, Math.min(1, dt * 3.5));
    controls.current?.update();
    if (camera.position.distanceTo(target.current) < 0.02) target.current = null;
  });
  return null;
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        blur={[400, 120]}
        resolution={768}
        mixBlur={1}
        mixStrength={18}
        roughness={0.9}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.3}
        color="#07070a"
        metalness={0.4}
        mirror={0.35}
      />
    </mesh>
  );
}

function Loader() {
  const { active, progress } = useProgress();
  if (!active && progress >= 100) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-white">
      <span className="h-10 w-10 animate-spin rounded-full border border-white/20 border-t-white" />
      <span className="t-label text-white/60">Building your car · {Math.round(progress)}%</span>
    </div>
  );
}

export default function CarViewer(props: SceneProps) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  return (
    <>
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [-5.2, 1.6, -5.6], fov: 32, near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      className="!absolute !inset-0"
    >
      <color attach="background" args={["#07070a"]} />
      <fog attach="fog" args={["#07070a", 18, 34]} />
      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          <Car color={props.color} livery={props.livery} coverage={props.coverage} finish={props.finish} />
        </group>
        <Floor />
        <ContactShadows position={[0, 0, 0]} opacity={0.85} scale={14} blur={2.2} far={2.5} />
        <Environment resolution={512}>
          <group rotation={[-Math.PI / 3, 0, 0]}>
            <Lightformer intensity={3} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[12, 1.6, 1]} />
            <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, 0]} scale={[12, 1.6, 1]} />
            <Lightformer intensity={2.5} rotation-x={Math.PI / 2} position={[0, 5, 9]} scale={[12, 1.6, 1]} />
            <Lightformer intensity={1.2} rotation-y={Math.PI / 2} position={[-12, 2, 0]} scale={[20, 4, 1]} color="#ff2fa0" />
            <Lightformer intensity={1.2} rotation-y={-Math.PI / 2} position={[12, 2, 0]} scale={[20, 4, 1]} color="#1ee3ff" />
          </group>
        </Environment>
        <spotLight position={[6, 9, 4]} angle={0.4} penumbra={1} intensity={60} castShadow shadow-bias={-0.0002} />
      </Suspense>
      <OrbitControls
        ref={controls}
        target={[0, 0.55, 0]}
        enablePan={false}
        minDistance={4.5}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate={props.autoRotate}
        autoRotateSpeed={0.7}
        enableDamping
        dampingFactor={0.06}
      />
      <CameraRig view={props.view} controls={controls} />
    </Canvas>
    <Loader />
    </>
  );
}

useGLTF.preload(MODEL);
