export const calculateHealthScore = ({ approvalDelayHours, conflictLikelihood, utilizationRatio, riskFlags }) => {
  let score = 100;
  score -= approvalDelayHours * 5;
  score -= conflictLikelihood * 30;
  score -= utilizationRatio * 20;
  score -= (riskFlags?.length ?? 0) * 10;

  if (score >= 70) {
    return "Green";
  }
  if (score >= 40) {
    return "Yellow";
  }
  return "Red";
};

export const detectRisks = ({ foodShortage, equipmentMaxed, venueNearCapacity, delayedApprovals }) => {
  const flags = [];
  if (foodShortage) flags.push("Food shortage risk");
  if (equipmentMaxed) flags.push("Equipment near max usage");
  if (venueNearCapacity) flags.push("Venue near capacity");
  if (delayedApprovals) flags.push("Approval delay risk");
  return flags;
};
