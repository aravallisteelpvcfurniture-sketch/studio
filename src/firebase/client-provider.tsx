
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
    const firebaseInstances = initializeFirebase();
    setInstances(firebaseInstances);
  }, []);

  if (!instances) return <div className="min-h-screen flex items-center justify-center">Loading Firebase...</div>;

  // Even if auth/db are null, we provide them to context to avoid breaking hooks
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
