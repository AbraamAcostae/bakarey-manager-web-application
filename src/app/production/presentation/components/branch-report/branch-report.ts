import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductionStore } from '../../../application/production.store';
import { ProductionReport } from '../../../domain/model/production-report.entity';

/**
 * Lets the user pick a branch and fetch its production report from the backend.
 */
@Component({
  selector: 'app-branch-report',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './branch-report.html',
  styleUrl: './branch-report.css',
})
export class BranchReport {
  private readonly store = inject(ProductionStore);
  private readonly fb = inject(FormBuilder);

  protected branches = this.store.branches;
  protected report = signal<ProductionReport | null>(null);
  protected loading = signal(false);
  protected loadError = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    branchId: [null, [Validators.required]],
  });

  onViewReport(): void {
    if (this.form.invalid) return;
    const branchId = Number(this.form.value.branchId);
    this.loading.set(true);
    this.loadError.set(null);
    this.store.generateReport(branchId).subscribe({
      next: (report) => {
        this.report.set(report);
        this.loading.set(false);
      },
      error: (err) => {
        this.loadError.set(err instanceof Error ? err.message : 'Failed to load report.');
        this.loading.set(false);
      },
    });
  }
}
