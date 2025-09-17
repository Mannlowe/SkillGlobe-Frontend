import { create } from 'zustand';

interface Nationality {
  name: string;
}

interface NationalityState {
  nationalities: Nationality[];
  setNationalities: (data: Nationality[]) => void;
}

export const useNationalityStore = create<NationalityState>((set) => ({
  nationalities: [],
  setNationalities: (data) => set({ nationalities: data }),
}));
