import { create } from 'zustand'

export interface Project {
  id: string
  path: string
  name: string
  createdAt: string
}

interface ProjectState {
  projects: Project[]
  activeProjectId: string | null
  addProject: (project: Project) => void
  removeProject: (projectId: string) => void
  setActiveProject: (projectId: string | null) => void
  getActiveProject: () => Project | undefined
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProjectId: null,
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
    })),
  setActiveProject: (projectId) => set({ activeProjectId: projectId }),
  getActiveProject: () => {
    const { projects, activeProjectId } = get()
    return projects.find((p) => p.id === activeProjectId)
  },
}))
