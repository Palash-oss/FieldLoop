/**
 * Job State Machine — enforces legal status transitions
 * 
 * requested → scheduled → en_route → in_progress → completed → invoiced → paid
 * Branches:
 *   cancelled ← from any pre-completed state
 *   needs_followup ← from in_progress back to scheduled
 */

const VALID_TRANSITIONS = {
  REQUESTED:   ['SCHEDULED', 'CANCELLED'],
  SCHEDULED:   ['EN_ROUTE', 'CANCELLED'],
  EN_ROUTE:    ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'NEEDS_FOLLOWUP', 'CANCELLED'],
  COMPLETED:   ['INVOICED'],
  INVOICED:    ['PAID'],
  NEEDS_FOLLOWUP: ['SCHEDULED', 'CANCELLED'],
  // PAID and CANCELLED are terminal states
  PAID:        [],
  CANCELLED:   [],
};

const ALL_STATUSES = Object.keys(VALID_TRANSITIONS);

/**
 * Checks if a transition from `currentStatus` to `newStatus` is legal.
 * @param {string} currentStatus 
 * @param {string} newStatus 
 * @returns {{ valid: boolean, message?: string }}
 */
function validateTransition(currentStatus, newStatus) {
  if (!ALL_STATUSES.includes(currentStatus)) {
    return { valid: false, message: `Unknown current status: ${currentStatus}` };
  }
  if (!ALL_STATUSES.includes(newStatus)) {
    return { valid: false, message: `Unknown target status: ${newStatus}` };
  }
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    return {
      valid: false,
      message: `Cannot transition from ${currentStatus} to ${newStatus}. Allowed transitions: ${allowed.join(', ') || 'none (terminal state)'}`,
    };
  }
  return { valid: true };
}

/**
 * Creates a status history entry.
 * @param {string} status 
 * @param {string} changedBy - User ID
 * @param {string} [note] 
 * @returns {{ status: string, changedBy: string, timestamp: Date, note?: string }}
 */
function createHistoryEntry(status, changedBy, note) {
  return {
    status,
    changedBy,
    timestamp: new Date(),
    ...(note ? { note } : {}),
  };
}

module.exports = {
  VALID_TRANSITIONS,
  ALL_STATUSES,
  validateTransition,
  createHistoryEntry,
};
