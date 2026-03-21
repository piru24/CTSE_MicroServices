const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  DISPATCHED: "dispatched",
  DELIVERED: "delivered"
};

const STATUS_TRANSITIONS = {
  [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.CONFIRMED],
  [ORDER_STATUSES.CONFIRMED]: [ORDER_STATUSES.DISPATCHED],
  [ORDER_STATUSES.DISPATCHED]: [ORDER_STATUSES.DELIVERED],
  [ORDER_STATUSES.DELIVERED]: []
};

function canTransitionStatus(currentStatus, nextStatus) {
  if (currentStatus === nextStatus) {
    return true;
  }

  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  return allowedTransitions.includes(nextStatus);
}

module.exports = {
  ORDER_STATUSES,
  STATUS_TRANSITIONS,
  canTransitionStatus
};
