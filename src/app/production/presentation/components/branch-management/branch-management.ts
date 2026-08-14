import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductionStore } from '../../../application/production.store';

/**
 * Lists branches and lets the user create new ones or toggle their active status.
 */
@Component({
  selector: 'app-branch-management',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './branch-management.html',
  styleUrl: './branch-management.css',
})
export class BranchManagement {
  private readonly store = inject(ProductionStore);
  private readonly fb = inject(FormBuilder);

  protected branches = this.store.branches;
  protected showForm = signal(false);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    location: ['', [Validators.required]],
  });

  openForm(): void {
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { name, location } = this.form.value;
    this.store.createBranch(name, location);
    this.form.reset();
    this.showForm.set(false);
  }

  onCancel(): void {
    this.form.reset();
    this.showForm.set(false);
  }

  toggleActive(branchId: number, active: boolean): void {
    this.store.patchBranchActive(branchId, !active);
  }
}
