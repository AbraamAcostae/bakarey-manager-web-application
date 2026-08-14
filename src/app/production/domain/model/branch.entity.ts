/**
 * Represents a bakery branch (sede) within the Production bounded context.
 */
export class Branch {
  private _id: number;
  private _name: string;
  private _location: string;
  private _active: boolean;

  constructor(branch: { id: number; name: string; location: string; active: boolean }) {
    this._id = branch.id;
    this._name = branch.name;
    this._location = branch.location;
    this._active = branch.active;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get location(): string { return this._location; }
  set location(value: string) { this._location = value; }

  get active(): boolean { return this._active; }
  set active(value: boolean) { this._active = value; }
}
