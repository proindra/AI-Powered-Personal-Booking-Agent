'use client';

import dynamic from 'next/dynamic';
import { Component, Suspense } from 'react';

// Silently catch any 3D/WASM errors — page must not crash
class ErrorBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  constructor(props: any) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return null; // silently hide on failure
    return this.props.children;
  }
}

const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => null,
});

export default function LanyardLoader() {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} fov={20} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
