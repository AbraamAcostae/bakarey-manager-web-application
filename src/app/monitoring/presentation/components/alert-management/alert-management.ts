import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MonitoringStore } from '../../../application/monitoring.store';
import { AlertSeverity } from '../../../domain/model/alert-severity.value-object';

/**
 * Lists alerts and lets the user create new ones, mark them as read or delete them.
 */
@Component({
  selector: 'app-alert-management',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './alert-management.html',
  styleUrl: './alert-management.css',
})
export class AlertManagement {
  private readonly store = inject(MonitoringStore);
  private readonly fb = inject(FormBuilder);

  protected alerts = this.store.alerts;
  protected severityOptions = [
    { value: AlertSeverity.LOW, key: 'LOW' },
    { value: AlertSeverity.MEDIUM, key: 'MEDIUM' },
    { value: AlertSeverity.HIGH, key: 'HIGH' },
    { value: AlertSeverity.CRITICAL, key: 'CRITICAL' },
  ];
  protected showForm = signal(false);

  form: FormGroup = this.fb.group({
    message: ['', [Validators.required]],
    severity: [AlertSeverity.LOW, [Validators.required]],
  });

  openForm(): void {
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { message, severity } = this.form.value;
    this.store.createAlert(message, Number(severity));
    this.form.reset({ severity: AlertSeverity.LOW });
    this.showForm.set(false);
  }

  onCancel(): void {
    this.form.reset({ severity: AlertSeverity.LOW });
    this.showForm.set(false);
  }

  markAsRead(id: number): void {
    this.store.markAlertAsRead(id);
  }

  delete(id: number): void {
    this.store.deleteAlert(id);
  }
}
