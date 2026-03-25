'use client';

import dynamic from 'next/dynamic';

const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => null,
});

export default function LanyardLoader() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} fov={20} />
    </div>
  );
}
