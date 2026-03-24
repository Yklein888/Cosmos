import { create } from 'zustand'

interface AppState {
  currentProjectPath: string | null
  isDarkMode: boolean
  setCurrentProjectPath: (path: string | null) => void
  toggleDarkMode: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentProjectPath: null,
  isDarkMode: true,
  setCurrentProjectPath: (path) => set({ currentProjectPath: path }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}))
