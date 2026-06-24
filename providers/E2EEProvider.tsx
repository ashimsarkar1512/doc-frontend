'use client';

import React from 'react';
import { useE2EE } from '@/Redux/hooks/useE2EE';

export const E2EEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize keys on mount and register them.
  useE2EE();
  
  return <>{children}</>;
};
