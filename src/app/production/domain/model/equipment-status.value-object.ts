/**
 * Represents the operational status of a piece of production equipment.
 *
 * @remarks
 * Value object of the Production bounded context. Mirrors the backend's
 * `EquipmentStatus` enum, serialized by name (e.g. "OPERATIONAL").
 */
export enum EquipmentStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE = 'MAINTENANCE',
  FAULT = 'FAULT',
  OFF = 'OFF',
}
