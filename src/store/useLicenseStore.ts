import { create } from 'zustand'
import type { LicenseTier, ProFeatureFlags } from '../types'
import { getFlagsForTier } from '../lib/pro'

// COSMOS personal build — always authenticated, all features unlocked, no license server
const UNLIMITED_FLAGS: ProFeatureFlags = getFlagsForTier('teams')

interface LicenseStore {
  tier: LicenseTier
  licenseKey: string | null
  email: string | null
  isValidating: boolean
  isAuthenticated: boolean
  authLoaded: boolean
  machineMismatch: boolean
  error: string | null
  flags: ProFeatureFlags

  checkLicense: () => Promise<void>
  activateLicense: (key: string) => Promise<{ valid: boolean; error?: string }>
  deactivateLicense: () => Promise<void>
  loginWithKey: (email: string, key?: string) => Promise<{ valid: boolean; error?: string }>
  logout: () => Promise<void>
  loadAuthState: () => Promise<void>
  recoverLicense: (email: string) => Promise<{ found: boolean; key?: string; error?: string }>
}

export const useLicenseStore = create<LicenseStore>(() => ({
  tier: 'teams',
  licenseKey: null,
  email: 'cosmos@local',
  isValidating: false,
  isAuthenticated: true,
  authLoaded: true,
  machineMismatch: false,
  error: null,
  flags: { ...UNLIMITED_FLAGS },

  loadAuthState: async () => {
    // Always unlocked — no server call needed
  },

  loginWithKey: async () => {
    return { valid: true }
  },

  logout: async () => {
    // No-op in personal build
  },

  checkLicense: async () => {
    // No-op in personal build
  },

  activateLicense: async () => {
    return { valid: true }
  },

  deactivateLicense: async () => {
    // No-op in personal build
  },

  recoverLicense: async () => {
    return { found: true, key: 'cosmos-personal' }
  },
}))
