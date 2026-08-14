import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductionStore } from '../../../application/production.store';
import { EquipmentStatus } from '../../../domain/model/equipment-status.value-object';

/**
 * Lets the user pick a branch, list its equipment, register new equipment
 * and change the operational status of existing equipment.
 */
@Component({
  selector: 'app-equipment-management',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './equipment-management.html',
  styleUrl: './equipment-management.css',
})
export class EquipmentManagement {
  private readonly store = inject(ProductionStore);
  private readonly fb = inject(FormBuilder);

  protected branches = this.store.branches;
  protected equipment = this.store.equipment;
  protected statusOptions = Object.values(EquipmentStatus);
  protected showForm = signal(false);

  branchForm: FormGroup = this.fb.group({
    branchId: [null, [Validators.required]],
  });

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    serialNumber: ['', [Validators.required]],
  });

  constructor() {
    this.branchForm.get('branchId')?.valueChanges.subscribe((branchId) => {
      if (branchId) this.store.loadEquipmentForBranch(Number(branchId));
    });
  }

  openForm(): void {
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid || this.branchForm.invalid) return;
    const { name, serialNumber } = this.form.value;
    const branchId = Number(this.branchForm.value.branchId);
    this.store.registerEquipment(name, serialNumber, branchId);
    this.form.reset();
    this.showForm.set(false);
  }

  onCancel(): void {
    this.form.reset();
    this.showForm.set(false);
  }

  onStatusChange(equipmentId: number, status: string): void {
    this.store.patchEquipmentStatus(equipmentId, status as EquipmentStatus);
  }
}
