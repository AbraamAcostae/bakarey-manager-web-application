import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductionStore } from '../../../application/production.store';

@Component({
  selector: 'app-batch-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './batch-form.html',
  styleUrl: './batch-form.css',
})
export class BatchForm {
  @Output() closed = new EventEmitter<void>();

  private readonly store = inject(ProductionStore);
  private readonly fb = inject(FormBuilder);

  protected branches = this.store.branches;
  protected equipment = this.store.equipment;

  form: FormGroup = this.fb.group({
    batchCode: ['', [Validators.required]],
    productName: ['', [Validators.required]],
    plannedQuantity: [1, [Validators.required, Validators.min(1)]],
    branchId: [null, [Validators.required]],
    equipmentId: [null, [Validators.required]],
  });

  constructor() {
    this.form.get('branchId')?.valueChanges.subscribe((branchId) => {
      this.form.get('equipmentId')?.setValue(null);
      if (branchId) this.store.loadEquipmentForBranch(Number(branchId));
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { batchCode, productName, plannedQuantity, branchId, equipmentId } = this.form.value;
    this.store.createBatch({
      batchCode,
      productName,
      plannedQuantity: Number(plannedQuantity),
      branchId: Number(branchId),
      equipmentId: Number(equipmentId),
    });
    this.form.reset({ plannedQuantity: 1 });
    this.closed.emit();
  }

  onCancel(): void {
    this.closed.emit();
  }
}
