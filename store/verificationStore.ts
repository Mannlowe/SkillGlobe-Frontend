import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VerificationState {
  isIdentityVerified: boolean;
  verifiedDocType: string | null;
  setIdentityVerified: (isVerified: boolean, docType: string | null) => void;
  resetVerification: () => void;
}

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set) => ({
      isIdentityVerified: false,
      verifiedDocType: null,
      setIdentityVerified: (isVerified, docType) => set({ 
        isIdentityVerified: isVerified,
        verifiedDocType: docType
      }),
      resetVerification: () => set({ 
        isIdentityVerified: false,
        verifiedDocType: null
      }),
    }),
    {
      name: 'verification-storage',
    }
  )
);
