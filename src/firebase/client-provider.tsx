
'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState(() => initializeFirebase());

  // Re-initialize only if needed, but the initial state is already set
  useEffect(() => {
    if (!instances.app) {
      setInstances(initializeFirebase());
    }
  }, [instances.app]);

  return (
    <FirebaseProvider
      app={instances.app as any}
      db={instances.db as any}
      auth={instances.auth as any}
    >
      {children}
    </FirebaseProvider>
  );
}
