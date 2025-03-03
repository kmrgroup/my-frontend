// Mining calculations with halving mechanism
export function calculateMiningReward(totalMined: string | null): number {
  // Base reward
  const initialReward = 0.00002;

  // If no mining history, return initial reward
  if (!totalMined || totalMined === "0") {
    return initialReward;
  }

  // Calculate halvings based on total mined amount
  const totalMinedNum = Number(totalMined);
  const halvingThreshold = 0.001; // Halve rewards every 0.001 units mined
  const halvings = Math.floor(totalMinedNum / halvingThreshold);

  // Calculate current reward with halvings
  const currentReward = initialReward / Math.pow(2, halvings);

  // Ensure minimum reward and proper decimal precision
  return Number(Math.max(0.00000001, currentReward).toFixed(8));
}

export function calculateCooldownTime(lastMiningTime: number): number {
  const cooldownPeriod = 5000; // 5 seconds cooldown
  const nextMiningTime = lastMiningTime + cooldownPeriod;
  return Math.max(0, nextMiningTime - Date.now());
}

export function formatHashRate(hashRate: number | null): string {
  if (!hashRate || hashRate === 0) return "0 H/s";
  return `${hashRate.toFixed(2)} H/s`;
}

export function getMiningSummary(totalMined: string | null) {
  const currentReward = calculateMiningReward(totalMined);
  const halvingThreshold = 0.001;
  const totalMinedNum = Number(totalMined || 0);
  const currentHalving = Math.floor(totalMinedNum / halvingThreshold);
  const nextHalving = (currentHalving + 1) * halvingThreshold;

  return {
    currentReward,
    currentHalving,
    nextHalvingAt: nextHalving,
    progress: ((totalMinedNum % halvingThreshold) / halvingThreshold) * 100
  };
}