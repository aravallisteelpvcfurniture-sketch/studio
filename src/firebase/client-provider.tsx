'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<{
    app: FirebaseApp | null;
    db: Firestore | null;
    auth: Auth | null;
  } | null>(null);

  useEffect(() => {
    // Delay slightly to allow main thread to breathe
    const timer = setTimeout(() => {
      const firebaseInstances = initializeFirebase();
      setInstances(firebaseInstances);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!instances) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
           <span className="text-white font-black text-xs">AS</span>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
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
