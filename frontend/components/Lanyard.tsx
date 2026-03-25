/* eslint-disable react/no-unknown-property */
'use client';

import { useRef, useState, useEffect, Suspense, Component, useMemo } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer, Html } from '@react-three/drei';
import {
  BallCollider, CuboidCollider, Physics, RigidBody,
  useRopeJoint, useSphericalJoint, RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { getPath } from '@/utils/paths';

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

extend({ MeshLineGeometry, MeshLineMaterial });

// Preload assets as soon as the module is imported — not on mount
const CARD_PATH    = getPath('/card.glb');
const LANYARD_PATH = getPath('/lanyard.png');
const ICON_PATH    = getPath('/icon.svg');
useGLTF.preload(CARD_PATH);

class ErrorBoundary extends Component<{ children: React.ReactNode }, { err: string | null }> {
  constructor(props: any) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(e: any) { return { err: String(e) }; }
  render() {
    if (this.state.err) return null; // fail silently — don't break the page
    return this.props.children;
  }
}

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
}

/** Animated shimmer shown while the 3D scene loads */
function LanyardSkeleton() {
  return (
    <Html fullscreen>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16,
        background: '#080810',
      }}>
        {/* Strap shimmer */}
        <div style={{
          width: 6, height: 180,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 100%)',
          borderRadius: 4,
          animation: 'lanyardShimmer 1.6s ease-in-out infinite',
        }} />
        {/* Card shimmer */}
        <div style={{
          width: 120, height: 170,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          animation: 'lanyardShimmer 1.6s ease-in-out infinite 0.3s',
        }} />
        <style>{`
          @keyframes lanyardShimmer {
            0%,100% { opacity: 0.4; }
            50%      { opacity: 1; }
          }
        `}</style>
      </div>
    </Html>
  );
}

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20 }: LanyardProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, 1.5]}          /* was [1,2] — caps pixel density, big win on retina screens */
        gl={{ alpha: false, antialias: !isMobile }}  /* skip AA on mobile */
        onCreated={({ gl }) => gl.setClearColor('#080810', 1)}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={<LanyardSkeleton />}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band isMobile={isMobile} />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer intensity={2}  color="white" position={[0, -1, 5]}   rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3}  color="white" position={[-1, -1, 1]}  rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3}  color="white" position={[1, 1, 1]}    rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
  const band  = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1    = useRef<any>(null);
  const j2    = useRef<any>(null);
  const j3    = useRef<any>(null);
  const card  = useRef<any>(null);

  // Stable Vector3 refs — avoid allocating new objects every frame
  const vec = useRef(new THREE.Vector3());
  const ang = useRef(new THREE.Vector3());
  const rot = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());

  const seg: any = { type: 'dynamic' as RigidBodyProps['type'], canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

  const { nodes, materials } = useGLTF(CARD_PATH) as any;
  const faviconTexture = useTexture(ICON_PATH);
  const strapTexture   = useMemo(() => faviconTexture.clone(), [faviconTexture]);

  useMemo(() => {
    faviconTexture.repeat.set(1.4, 1.4);
    faviconTexture.offset.set(-0.2, -0.2);
    faviconTexture.center.set(0.5, 0.5);
    faviconTexture.wrapS = faviconTexture.wrapT = THREE.ClampToEdgeWrapping;
    faviconTexture.minFilter = THREE.LinearFilter;
    faviconTexture.magFilter = THREE.LinearFilter;
    faviconTexture.anisotropy = 16;
    faviconTexture.needsUpdate = true;

    strapTexture.repeat.set(2, 2);
    strapTexture.wrapS = strapTexture.wrapT = THREE.RepeatWrapping;
    strapTexture.minFilter = THREE.LinearFilter;
    strapTexture.magFilter = THREE.LinearFilter;
    strapTexture.anisotropy = 16;
  }, [faviconTexture, strapTexture]);

  const [curve]   = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag]   = useState<false | THREE.Vector3>(false);
  const [hovered, hover]  = useState(false);

  useRopeJoint(fixed, j1, [[0,0,0],[0,0,0],1]);
  useRopeJoint(j1, j2,    [[0,0,0],[0,0,0],1]);
  useRopeJoint(j2, j3,    [[0,0,0],[0,0,0],1]);
  useSphericalJoint(j3, card, [[0,0,0],[0,1.45,0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = 'auto'; };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const v = vec.current, a = ang.current, r = rot.current, d = dir.current;
    if (dragged && typeof dragged !== 'boolean') {
      v.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      d.copy(v).sub(state.camera.position).normalize();
      v.add(d.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: v.x - dragged.x, y: v.y - dragged.y, z: v.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const dist = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + dist * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 28));
      a.copy(card.current.angvel());
      r.copy(card.current.rotation());
      card.current.setAngvel({ x: a.x, y: a.y - r.y * 0.25, z: a.z });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...seg} type="fixed" />
        <RigidBody position={[0.5,0,0]} ref={j1} {...seg}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1,0,0]}   ref={j2} {...seg}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5,0,0]} ref={j3} {...seg}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2,0,0]}   ref={card} {...seg} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group scale={2.25} position={[0,-1.2,-0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={()  => hover(false)}
            onPointerUp={(e: any)   => { e.target.releasePointerCapture(e.pointerId); drag(false); }}
            onPointerDown={(e: any) => { e.target.setPointerCapture(e.pointerId); drag(new THREE.Vector3().copy(e.point).sub(vec.current.copy(card.current.translation()))); }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                color="#ffffff"
                map={faviconTexture}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry}  material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[1000, 1000]} useMap map={strapTexture} repeat={[-4, 1]} lineWidth={1} />
      </mesh>
    </>
  );
}
