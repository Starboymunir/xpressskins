"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture, OrbitControls, Environment, ContactShadows, MeshReflectorMaterial, Lightformer, useProgress } from "@react-three/drei";
import { EffectComposer, Bloom, N8AO, SMAA, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { LIVERIES, FALLBACK_MODEL, type Coverage, type FinishId, type ViewId, type BodyKind } from "./studioData";
export { LIVERIES, PAINTS, FALLBACK_MODEL } from "./studioData";
export type { Coverage, FinishId, ViewId, BodyKind } from "./studioData";

const LENGTH: Record<BodyKind, number> = { sports: 4.55, coupe: 4.6, sedan: 4.75, hatchback: 4.3, wagon: 4.8, suv: 4.85, truck: 5.7, van: 5.6 };

interface SceneProps {
  modelUrl: string;
  body: BodyKind;
  /** offline analysis from scripts/analyze-models.mjs */
  config?: { paint: string[]; frontSign: number; longAxis: string; upsideDown?: boolean };
  color: string;
  livery: string;
  coverage: Coverage;
  finish: FinishId;
  view: ViewId;
  autoRotate: boolean;
}

/* ── finishes: the numbers that make gloss, satin and matte look different ── */
const FINISH: Record<FinishId, { roughness: number; metalness: number; clearcoat: number; clearcoatRoughness: number; envMapIntensity: number; sheen: number }> = {
  gloss: { roughness: 0.035, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.0, envMapIntensity: 2.4, sheen: 0 },
  satin: { roughness: 0.5, metalness: 0.08, clearcoat: 0.3, clearcoatRoughness: 0.55, envMapIntensity: 0.9, sheen: 0.2 },
  matte: { roughness: 1.0, metalness: 0.0, clearcoat: 0, clearcoatRoughness: 1, envMapIntensity: 0.15, sheen: 0.3 },
};

const PAINT_NAME = /(car_?paint|paint|body|carbody|exterior|chassis|shell|coque|carroc|karosserie|main_?col|color|colour)/i;
const NOT_PAINT = /(glass|window|windshield|tint|tire|tyre|rubber|chrome|light|lamp|led|interior|seat|leather|carpet|plastic|rim|wheel|brake|caliper|disc|grill|mirror_glass|plate|logo|emblem|badge|black|trim|exhaust|engine|shadow|ao)/i;

/* ── world-space livery projection material ── */
function useBodyMaterial() {
  const uniforms = useMemo(
    () => ({
      uArt: { value: null as THREE.Texture | null },
      uColor: { value: new THREE.Color("#eef0f2") },
      uSide: { value: 1 }, uTop: { value: 1 }, uHalf: { value: 0 }, uEnds: { value: 1 },
      uMin: { value: new THREE.Vector3(-1, 0, -2) },
      uSize: { value: new THREE.Vector3(2, 1.3, 4.6) },
      uArtAspect: { value: 1376 / 768 },
      uFlake: { value: 1 },
    }),
    [],
  );
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, ...FINISH.gloss, sheenColor: new THREE.Color("#ffffff"), sheenRoughness: 0.8 });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vWPos;\nvarying vec3 vWNrm;")
        .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWNrm = normalize(mat3(modelMatrix) * objectNormal);");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>
varying vec3 vWPos; varying vec3 vWNrm;
uniform sampler2D uArt; uniform vec3 uColor; uniform float uSide; uniform float uTop; uniform float uHalf; uniform float uEnds; uniform vec3 uMin; uniform vec3 uSize; uniform float uArtAspect; uniform float uFlake;
float xsWrapMask = 0.0;
float xsHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }`)
        .replace("#include <color_fragment>", `#include <color_fragment>
{
  vec3 n = normalize(vWNrm);
  vec3 p = (vWPos - uMin) / uSize;            // 0..1 across the car's bounding box
  float sideW = smoothstep(0.30, 0.62, abs(n.x));
  float topW  = smoothstep(0.30, 0.62, n.y);
  float endW  = smoothstep(0.30, 0.62, abs(n.z)) * (1.0 - topW);
  // keep the artwork's real proportions: it spans the car's length, and its height follows
  // the image ratio (centred a little low so the character sits on the doors, not the roof)
  float artH = uSize.z / uArtAspect;
  float u = n.x > 0.0 ? 1.0 - p.z : p.z;
  float v = 0.5 + ((vWPos.y - uMin.y) - uSize.y * 0.42) / artH;
  vec3 sideCol = texture2D(uArt, vec2(clamp(u, 0.0, 1.0), clamp(v, 0.0, 1.0))).rgb;
  float vt = 0.5 + ((vWPos.x - uMin.x) - uSize.x * 0.5) / artH;
  vec3 topCol  = texture2D(uArt, vec2(clamp(1.0 - p.z, 0.0, 1.0), clamp(vt, 0.0, 1.0))).rgb;
  float ue = 0.5 + ((vWPos.x - uMin.x) - uSize.x * 0.5) / (artH * uArtAspect) * (n.z > 0.0 ? 1.0 : -1.0);
  vec3 endCol  = texture2D(uArt, vec2(clamp(ue, 0.0, 1.0), clamp(v, 0.0, 1.0))).rgb;
  float halfMask = uHalf > 0.5 ? step(p.x, 0.5) : 1.0;
  float m = max(max(sideW * uSide * halfMask, topW * uTop), endW * uEnds);
  vec3 wrap = (sideCol * sideW + topCol * topW + endCol * endW) / (sideW + topW + endW + 1e-4);
  diffuseColor.rgb = mix(uColor, wrap, m);
  xsWrapMask = m;
}`)
        .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
{
  float flake = xsHash(floor(vWPos * 900.0));
  roughnessFactor = clamp(roughnessFactor + (flake - 0.5) * 0.12 * uFlake * (1.0 - xsWrapMask), 0.02, 1.0);
}`)
        .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
{
  vec3 fl = vec3(xsHash(floor(vWPos * 900.0) + 1.3), xsHash(floor(vWPos * 900.0) + 7.1), xsHash(floor(vWPos * 900.0) + 3.7)) - 0.5;
  normal = normalize(normal + fl * 0.09 * uFlake * (1.0 - xsWrapMask));
}`);
    };
    m.customProgramCacheKey = () => "xs-livery-world-v2";
    return m;
  }, [uniforms]);
  return { material, uniforms };
}

function surfaceArea(g: THREE.BufferGeometry) {
  const pos = g.getAttribute("position"); if (!pos) return 0;
  const idx = g.getIndex(); const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  let area = 0; const tri = idx ? idx.count / 3 : pos.count / 3;
  const step = Math.max(1, Math.floor(tri / 4000)); // sample for speed
  for (let t = 0; t < tri; t += step) {
    const i0 = idx ? idx.getX(t * 3) : t * 3, i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
    a.fromBufferAttribute(pos, i0); b.fromBufferAttribute(pos, i1); c.fromBufferAttribute(pos, i2);
    area += b.sub(a).cross(c.sub(a)).length() * 0.5 * step;
  }
  return area;
}

/* ── any glTF car → oriented, scaled, grounded, with paint swapped ── */
function Car({ modelUrl, body, config, color, livery, coverage, finish }: Omit<SceneProps, "view" | "autoRotate">) {
  const { scene: src } = useGLTF(modelUrl, true);
  const art = useTexture(LIVERIES.find((l) => l.id === livery)?.src ?? LIVERIES[0].src);
  const { material, uniforms } = useBodyMaterial();

  const root = useMemo(() => {
    const scene = src.clone(true);
    // 1. find paint materials
    const meshes: THREE.Mesh[] = [];
    scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) meshes.push(m); });
    const byMat = new Map<THREE.Material, { area: number; meshes: THREE.Mesh[] }>();
    for (const mesh of meshes) {
      mesh.castShadow = mesh.receiveShadow = true;
      for (const mat of ([] as THREE.Material[]).concat(mesh.material)) {
        const e = byMat.get(mat) ?? { area: 0, meshes: [] };
        e.area += surfaceArea(mesh.geometry); e.meshes.push(mesh); byMat.set(mat, e);
      }
    }
    let paint = config?.paint.length ? [...byMat.keys()].filter((m) => config.paint.includes(m.name)) : [...byMat.keys()].filter((m) => PAINT_NAME.test(m.name) && !NOT_PAINT.test(m.name));
    if (modelUrl === FALLBACK_MODEL) paint = [...byMat.keys()].filter((m) => m.name === "Body_Color");
    if (!paint.length && !config) {
      const ranked = [...byMat.entries()].filter(([m]) => !NOT_PAINT.test(m.name) && !(m as THREE.MeshStandardMaterial).transparent).sort((a, b) => b[1].area - a[1].area);
      if (ranked[0]) paint = [ranked[0][0]];
    }
    const paintSet = new Set(paint);
    for (const mesh of meshes) {
      if (Array.isArray(mesh.material)) mesh.material = mesh.material.map((m) => (paintSet.has(m) ? material : m));
      else if (paintSet.has(mesh.material)) mesh.material = material;
      const std = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
      if (std !== material && /glass|window|windshield/i.test(std.name)) {
        mesh.material = new THREE.MeshPhysicalMaterial({ color: 0x0a0f14, metalness: 0, roughness: 0.02, transparent: true, opacity: 0.55, clearcoat: 1, envMapIntensity: 2 });
      } else if (std !== material && /chrome/i.test(std.name)) { std.metalness = 1; std.roughness = 0.08; }
    }
    // nose point in file coordinates, from the offline analysis
    const box0 = new THREE.Box3().setFromObject(scene);
    const nose = box0.getCenter(new THREE.Vector3());
    if (config) { const ax = config.longAxis as "x" | "y" | "z"; nose[ax] = config.frontSign < 0 ? box0.min[ax] : box0.max[ax]; }
    // 2. orient: longest horizontal axis → z
    let box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    if (size.y > size.z && size.y > size.x) scene.rotation.x = -Math.PI / 2; // Z-up exports
    scene.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(scene); box.getSize(size);
    if (size.x > size.z) { scene.rotation.y += Math.PI / 2; scene.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(scene); box.getSize(size); }
    // 2a. upside-down files: the tyres must sit below the middle of the car
    {
      const tyres = new THREE.Box3();
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && /tire|tyre|wheel|rim|rubber|pneu/i.test(`${m.name} ${([] as THREE.Material[]).concat(m.material).map((x) => x.name).join(" ")}`)) tyres.expandByObject(m); });
      if (config?.upsideDown || (!tyres.isEmpty() && tyres.getCenter(new THREE.Vector3()).y > box.getCenter(new THREE.Vector3()).y)) {
        scene.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), Math.PI);
        scene.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(scene); box.getSize(size);
      }
    }
    // 2b. nose: our cameras expect the front of the car at -z (as the reference coupe).
    if (config) {
      const w = nose.clone().applyMatrix4(scene.matrixWorld);
      if (w.z > box.getCenter(new THREE.Vector3()).z) { scene.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI); scene.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(scene); box.getSize(size); }
    } else {
    //     Compare where front-ish parts (head lights, grille, front bumper) sit against rear-ish parts.
    const FRONT = /head ?light|headlamp|head|grill|grille|front|fr|bumper_?f|f_?bumper|hood|bonnet|windshield|license_?plate_?f/i;
    const REAR = /tail ?light|taillamp|tail|brake ?light|rear|rr|bumper_?r|r_?bumper|trunk|boot|exhaust|muffler|tailgate|license_?plate_?r/i;
    let fz = 0, fn = 0, rz = 0, rn = 0;
    const tmp = new THREE.Box3(), ctr = new THREE.Vector3();
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const label = `${m.name} ${([] as THREE.Material[]).concat(m.material).map((x) => x.name).join(" ")} ${m.parent?.name ?? ""}`;
      const isF = FRONT.test(label), isR = REAR.test(label);
      if (isF === isR) return;
      tmp.setFromObject(m).getCenter(ctr);
      if (isF) { fz += ctr.z; fn++; } else { rz += ctr.z; rn++; }
    });
    if (fn && rn && fz / fn > rz / rn) { scene.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI); scene.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(scene); box.getSize(size); }
    else if (fn && !rn && fz / fn > box.getCenter(new THREE.Vector3()).z) { scene.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI); scene.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(scene); box.getSize(size); }
    else if (rn && !fn && rz / rn < box.getCenter(new THREE.Vector3()).z) { scene.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI); scene.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(scene); box.getSize(size); }
    }
    // 3. scale to a real length and ground it
    const s = LENGTH[body] / size.z;
    scene.scale.multiplyScalar(s);
    scene.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(scene);
    const c = box.getCenter(new THREE.Vector3());
    scene.position.x -= c.x; scene.position.z -= c.z; scene.position.y -= box.min.y;
    scene.updateMatrixWorld(true);
    // 4. bounds for the livery projection, from the paint meshes only
    const pb = new THREE.Box3();
    scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && ([] as THREE.Material[]).concat(m.material).includes(material)) pb.expandByObject(m); });
    if (pb.isEmpty()) pb.setFromObject(scene);
    uniforms.uMin.value.copy(pb.min); uniforms.uSize.value.copy(pb.getSize(new THREE.Vector3()));
    return scene;
  }, [src, modelUrl, body, config, material, uniforms]);

  useEffect(() => {
    art.colorSpace = THREE.SRGBColorSpace; art.anisotropy = 16; uniforms.uArt.value = art;
    const img = art.image as { width?: number; height?: number } | undefined;
    if (img?.width && img?.height) uniforms.uArtAspect.value = img.width / img.height;
  }, [art, uniforms]);
  useEffect(() => { uniforms.uColor.value.set(color); }, [color, uniforms]);
  useEffect(() => {
    uniforms.uSide.value = coverage === "hood" ? 0 : 1;
    uniforms.uTop.value = coverage === "sides" ? 0 : 1;
    uniforms.uHalf.value = coverage === "half" ? 1 : 0;
    uniforms.uEnds.value = coverage === "full" ? 1 : 0;
  }, [coverage, uniforms]);
  useEffect(() => {
    const f = FINISH[finish];
    uniforms.uFlake.value = finish === "gloss" ? 1 : finish === "satin" ? 0.6 : 0;
    Object.assign(material, { roughness: f.roughness, metalness: f.metalness, clearcoat: f.clearcoat, clearcoatRoughness: f.clearcoatRoughness, envMapIntensity: f.envMapIntensity, sheen: f.sheen });
    material.needsUpdate = true;
  }, [finish, material, uniforms]);

  return <primitive object={root} />;
}

/* ── reflections drift around the car; a finish change fires a fast light sweep ── */
function LightSweep({ finish }: { finish: FinishId }) {
  const scene = useThree((s) => s.scene);
  const sweep = useRef(0);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } sweep.current = 1; }, [finish]);
  useFrame((_, dt) => {
    const extra = sweep.current > 0 ? dt * 5.2 * Math.sin(sweep.current * Math.PI) : 0;
    sweep.current = Math.max(0, sweep.current - dt * 0.85);
    scene.environmentRotation.y += dt * 0.12 + extra;
    scene.backgroundRotation.y = scene.environmentRotation.y;
  });
  return null;
}

function CameraRig({ view, controls, body }: { view: ViewId; controls: React.RefObject<OrbitControlsImpl | null>; body: BodyKind }) {
  const { camera } = useThree();
  const target = useRef<THREE.Vector3 | null>(null);
  const k = LENGTH[body] / 4.6;
  useEffect(() => {
    if (view === "free") return;
    const v = { front: [-5.2, 1.6, -5.6], side: [8.2, 1.3, 0.01], rear: [5.2, 1.6, 5.6], top: [0.01, 10.5, 0.01] }[view] as [number, number, number];
    target.current = new THREE.Vector3(v[0] * k, v[1] * Math.max(1, k * 0.9), v[2] * k);
  }, [view, k]);
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      {/* polished concrete: sharp near the tyres, softening with distance */}
      <MeshReflectorMaterial blur={[180, 60]} resolution={1024} mixBlur={0.8} mixStrength={40} roughness={0.72} depthScale={1.4} minDepthThreshold={0.35} maxDepthThreshold={1.5} color="#0b0b0e" metalness={0.5} mirror={0.75} />
    </mesh>
  );
}

/* ── the showroom: curved backdrop + ceiling light panels you can see in the paint and floor ── */
function Showroom({ k }: { k: number }) {
  const cyc = useMemo(() => {
    // a quarter-pipe "infinity cove" behind and around the car
    const g = new THREE.CylinderGeometry(11 * k, 11 * k, 10, 160, 1, true);
    return g;
  }, [k]);
  return (
    <group>
      <mesh geometry={cyc} position={[0, 5, 0]} rotation={[0, Math.PI, 0]} receiveShadow>
        <meshStandardMaterial color="#26262d" roughness={0.9} metalness={0} side={THREE.BackSide} />
      </mesh>
      {/* ceiling softboxes: long emissive strips, bright enough to bloom */}
      {[-2.4, 0, 2.4].map((x) => (
        <mesh key={x} position={[x * k, 6.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 9 * k]} />
          <meshBasicMaterial color={[2.6, 2.6, 2.75]} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* low accent strips on the cove, brand colours */}
      <mesh position={[-7.6 * k, 0.5, -7.6 * k]} rotation={[0, Math.PI / 4, 0]}>
        <planeGeometry args={[6, 0.1]} />
        <meshBasicMaterial color={[3, 0.5, 1.8]} toneMapped={false} />
      </mesh>
      <mesh position={[7.6 * k, 0.5, -7.6 * k]} rotation={[0, -Math.PI / 4, 0]}>
        <planeGeometry args={[6, 0.1]} />
        <meshBasicMaterial color={[0.4, 2.4, 3]} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Loader() {
  const { active, progress } = useProgress();
  if (!active && progress >= 100) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-white">
      <span className="h-10 w-10 animate-spin rounded-full border border-white/20 border-t-white" />
      <span className="t-label text-white/60">Rolling your car in · {Math.round(progress)}%</span>
    </div>
  );
}

export default function CarViewer(props: SceneProps) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const k = LENGTH[props.body] / 4.6;
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [-5.2 * k, 1.6, -5.6 * k], fov: 32, near: 0.1, far: 120 }}
        gl={{ antialias: false, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping, stencil: false }}
        className="!absolute !inset-0"
      >
        <color attach="background" args={["#0a0a0d"]} />
        <fog attach="fog" args={["#0a0a0d", 24 * k, 60 * k]} />
        <Suspense fallback={null}>
          <Car key={props.modelUrl} modelUrl={props.modelUrl} body={props.body} config={props.config} color={props.color} livery={props.livery} coverage={props.coverage} finish={props.finish} />
          <Floor />
          <Showroom k={k} />
          <ContactShadows position={[0, 0.001, 0]} opacity={0.9} scale={16 * k} blur={2.4} far={3} resolution={1024} />
          {/* dark showroom: bright softboxes on black, so gloss shows crisp light bands and matte shows none */}
          <Environment resolution={1024} environmentIntensity={1}>
            <color attach="background" args={["#0b0b0e"]} />
            {/* same three ceiling strips as the visible set, so the reflections match */}
            <Lightformer form="rect" intensity={6} position={[-2.4, 6.2, 0]} rotation-x={Math.PI / 2} scale={[0.7, 9, 1]} />
            <Lightformer form="rect" intensity={6} position={[0, 6.2, 0]} rotation-x={Math.PI / 2} scale={[0.7, 9, 1]} />
            <Lightformer form="rect" intensity={6} position={[2.4, 6.2, 0]} rotation-x={Math.PI / 2} scale={[0.7, 9, 1]} />
            <Lightformer form="rect" intensity={2.2} position={[-10, 2.6, 0]} rotation-y={Math.PI / 2} scale={[18, 1.4, 1]} />
            <Lightformer form="rect" intensity={2.2} position={[10, 2.6, 0]} rotation-y={-Math.PI / 2} scale={[18, 1.4, 1]} />
            <Lightformer form="rect" intensity={0.8} position={[0, 0.8, -14]} scale={[24, 1.2, 1]} />
            <Lightformer form="rect" intensity={2.4} position={[-14, 0.6, -10]} rotation-y={Math.PI / 4} scale={[10, 0.4, 1]} color="#ff2fa0" />
            <Lightformer form="rect" intensity={2.4} position={[14, 0.6, -10]} rotation-y={-Math.PI / 4} scale={[10, 0.4, 1]} color="#1ee3ff" />
          </Environment>
          <ambientLight intensity={0.08} />
          <directionalLight position={[5, 10, 4]} intensity={0.9} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} />
          <LightSweep finish={props.finish} />
        </Suspense>
        <OrbitControls ref={controls} target={[0, 0.6 * Math.max(1, k * 0.95), 0]} enablePan={false} minDistance={4.2 * k} maxDistance={13 * k} maxPolarAngle={Math.PI / 2.06} autoRotate={props.autoRotate} autoRotateSpeed={0.6} enableDamping dampingFactor={0.06} />
        <CameraRig view={props.view} controls={controls} body={props.body} />
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <N8AO halfRes aoRadius={1} intensity={1.6} distanceFalloff={0.6} />
          <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.25} intensity={0.7} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette eskil={false} offset={0.3} darkness={0.55} />
          <SMAA />
        </EffectComposer>
      </Canvas>
      <Loader />
    </>
  );
}

useGLTF.preload(FALLBACK_MODEL);
