/**
 * Infrastructure resource contract for the branch production report payload.
 *
 * @remarks
 * Mirrors the backend's `BranchReportResource` returned by
 * `GET /api/v1/branches/{id}/report`. It is a read-only projection, not a
 * CRUD resource, so it has no surrogate `id` of its own.
 */
export interface BranchReportResource {
  branchId: number;
  totalBatches: number;
  totalPlannedQuantity: number;
  totalProducedQuantity: number;
  plannedBatches: number;
  inProgressBatches: number;
  completedBatches: number;
  cancelledBatches: number;
}
