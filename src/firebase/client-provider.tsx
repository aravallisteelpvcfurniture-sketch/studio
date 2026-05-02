
'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<{
    app: FirebaseApp | null;
    db: Firestore | null;
    auth: Auth | null;
  } | null>(null);

  useEffect(() => {
    // Immediate initialization for faster loading
    const firebaseInstances = initializeFirebase();
    setInstances(firebaseInstances);
  }, []);

  if (!instances) {
    // Very minimal loader to reduce "blank" feeling
    return null;
  }

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
