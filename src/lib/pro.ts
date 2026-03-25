import type { LicenseTier, ProFeatureFlags } from '../types'

// COSMOS personal build — all features unlocked, no license required
export const FREE_LIMITS: ProFeatureFlags = {
  tier: 'teams',
  maxAgents: Infinity,
  maxMcpServers: Infinity,
  maxProjects: Infinity,
  teamMode: true,
  teamSync: true,
  premiumAgents: true,
  enabledFeatures: [],
}

export function getFlagsForTier(_tier: LicenseTier): ProFeatureFlags {
  return { ...FREE_LIMITS }
}

export async function loadProModule(): Promise<typeof import('@pilos/pro') | null> {
  try {
    const mod = await import('@pilos/pro')
    return mod
  } catch {
    return null
  }
}
