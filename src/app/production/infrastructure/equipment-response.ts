/**
 * Infrastructure resource contract for equipment payloads.
 *
 * @remarks
 * Mirrors the backend's `EquipmentResource`. It has no `branchId` of its own —
 * equipment is always read scoped to the branch that owns it.
 */
export interface EquipmentResource {
  id: number;
  name: string;
  serialNumber: string;
  status: string;
}
