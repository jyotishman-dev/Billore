'use client';

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { restorePrefs, startMirroring } from '../utils/prefsMirror';

const DynamicApp = dynamic(
  () => import('../App'),
  {
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>
        <p>Loading Billore...</p>
      </div>
    ),
  }
);

const AppLockGate = dynamic(
  () => import('../components/AppLock'),
  { ssr: false }
);

export default function AppWrapper() {
  useEffect(() => {
    try {
      restorePrefs();
      startMirroring();
    } catch (e) {
      console.warn('Prefs mirror init error:', e);
    }
  }, []);

  return (
    <AppLockGate>
      <DynamicApp />
    </AppLockGate>
  );
}
