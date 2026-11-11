import { inventorySlots, type InventorySlot } from './inventory';
import { calculateBuild, validateProfile, statKeys, type StatKey, type Loadout, type BuildProfile } from './comparison';
import { objectiveScore, targetBounds, type Objective, type SearchReport, type SearchResult, type TargetStat, type TargetOptions } from './optimizer';

export type EquipmentAssessment = {
  slots: { slot: InventorySlot; filled: boolean }[];
  filledCount: number;
  complete: boolean;
};

export function assessEquipment(loadout: Loadout): EquipmentAssessment {
  const slots = inventorySlots.map(slot => ({ slot, filled: !!loadout[slot] }));
  const filledCount = slots.filter(s => s.filled).length;
  return { slots, filledCount, complete: filledCount === inventorySlots.length };
}

export type TargetGap = {
  stat: TargetStat;
  actual: number;
  minimum?: number;
  maximum?: number;
  met: boolean;
  gap: number; // Signed distance from the violated bound; zero within the inclusive range.
};

export type TargetAssessment = {
  gaps: TargetGap[];
  status: 'met' | 'below' | 'no-targets' | 'profile-incomplete';
};

export function assessTargets(totals: SearchResult['totals'] | null, options: TargetOptions): TargetAssessment {
  const bounds = targetBounds(options);
  if (!totals) return { gaps: [], status: 'profile-incomplete' };
  const gaps = bounds.map(({ stat, minimum, maximum }) => {
    const actual = totals[stat];
    if (!Number.isFinite(actual)) throw new Error(`Cannot assess nonfinite ${stat}.`);
    const gap = minimum !== undefined && actual < minimum ? actual - minimum
      : maximum !== undefined && actual > maximum ? actual - maximum : 0;
    return { stat, actual, minimum, maximum, met: gap === 0, gap };
  });
  return { gaps, status: gaps.length === 0 ? 'no-targets' : gaps.every(g => g.met) ? 'met' : 'below' };
}

export function assessCurrentBuild(profile: BuildProfile | null, loadout: Loadout, options: TargetOptions) {
  const equipment = assessEquipment(loadout);
  let profileError: string | null = null;
  try {
    if (!profile) throw new Error('Choose or complete a character profile.');
    validateProfile(profile);
  } catch (error) {
    profileError = error instanceof Error ? error.message : 'Profile validation failed.';
  }
  // Invalid equipment still fails calculation; missing slots retain their partial totals.
  const build = profile && !profileError ? calculateBuild(profile, loadout) : null;
  const warnings = build ? [...build.warnings] : [];
  if (build && build.totals['CRIT Rate_'] > 100) {
    warnings.push('CRIT Rate exceeds 100%; raw CV is not capped and may include wasted CRIT Rate.');
  }
  return { equipment, build, targets: assessTargets(build?.totals ?? null, options), profileError, warnings };
}

export type CandidateDelta = {
  stats: { key: StatKey; current: number; candidate: number; delta: number }[];
  objectiveChange: number;
  currentScore: number;
  candidateScore: number;
  currentPartial: boolean;
  changedSlots: InventorySlot[];
  warnings: { current: string[]; candidate: string[] };
};

// Candidates come from the caller's current eligible search pool; both sides use this profile.
export function assessCandidate(profile: BuildProfile, current: Loadout, candidate: Loadout, objective: Objective): CandidateDelta {
  if (!assessEquipment(candidate).complete) throw new Error('Candidate must contain all six equipment slots.');
  const currentBuild = calculateBuild(profile, current);
  const candidateBuild = calculateBuild(profile, candidate);
  const currentTotals = currentBuild.totals;
  const candidateTotals = candidateBuild.totals;
  const currentScore = objectiveScore(currentTotals, objective);
  const candidateScore = objectiveScore(candidateTotals, objective);
  if (!Number.isFinite(currentScore) || !Number.isFinite(candidateScore)) throw new Error('Objective overflow. Check imported values and profile.');
  const stats = statKeys.map(key => ({ key, current: currentTotals[key], candidate: candidateTotals[key], delta: candidateTotals[key] - currentTotals[key] }));
  return {
    stats, objectiveChange: candidateScore - currentScore, currentScore, candidateScore,
    currentPartial: !assessEquipment(current).complete,
    changedSlots: inventorySlots.filter(slot => current[slot]?.id !== candidate[slot]?.id),
    warnings: { current: currentBuild.warnings, candidate: candidateBuild.warnings },
  };
}

export type SearchStatus =
  | { kind: 'no-search' }
  | { kind: 'exact-optimum'; result: SearchResult; exclusions: string[] }
  | { kind: 'best-found'; result: SearchResult; exhaustive: boolean; exclusions: string[] }
  | { kind: 'no-feasible'; exhaustive: true; exclusions: string[] }
  | { kind: 'inconclusive'; exhaustive: boolean; exclusions: string[] };

// Only completed, current reports belong here; the runner owns cancellation and revision checks.
export function classifySearch(report: SearchReport | null): SearchStatus {
  if (!report) return { kind: 'no-search' };
  const exclusions = report.invalidReasons.slice();
  const exact = report.exhaustive && report.invalid === 0;
  const result = report.results[0];
  if (!result) return exact ? { kind: 'no-feasible', exhaustive: true, exclusions }
    : { kind: 'inconclusive', exhaustive: report.exhaustive, exclusions };
  return exact ? { kind: 'exact-optimum', result, exclusions }
    : { kind: 'best-found', result, exhaustive: report.exhaustive, exclusions };
}
