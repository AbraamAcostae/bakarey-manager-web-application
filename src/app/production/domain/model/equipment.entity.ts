import { EquipmentStatus } from './equipment-status.value-object';

/**
 * Represents a piece of production equipment (oven, mixer, etc.) scoped to a branch.
 */
export class Equipment {
  private _id: number;
  private _name: string;
  private _serialNumber: string;
  private _status: EquipmentStatus;

  constructor(equipment: { id: number; name: string; serialNumber: string; status: EquipmentStatus }) {
    this._id = equipment.id;
    this._name = equipment.name;
    this._serialNumber = equipment.serialNumber;
    this._status = equipment.status;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get serialNumber(): string { return this._serialNumber; }
  set serialNumber(value: string) { this._serialNumber = value; }

  get status(): EquipmentStatus { return this._status; }
  set status(value: EquipmentStatus) { this._status = value; }
}
