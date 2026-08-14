import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MonitoringStore } from '../../../application/monitoring.store';
import { IncidentStatus } from '../../../domain/model/incident-status.value-object';

/**
 * Lists incidents and lets the user report new ones or transition their status.
 */
@Component({
  selector: 'app-incident-management',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './incident-management.html',
  styleUrl: './incident-management.css',
})
export class IncidentManagement {
  private readonly store = inject(MonitoringStore);
  private readonly fb = inject(FormBuilder);

  protected incidents = this.store.incidents;
  protected IncidentStatus = IncidentStatus;
  protected showForm = signal(false);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  openForm(): void {
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { title, description } = this.form.value;
    this.store.createIncident(title, description);
    this.form.reset();
    this.showForm.set(false);
  }

  onCancel(): void {
    this.form.reset();
    this.showForm.set(false);
  }

  confirm(id: number): void {
    this.store.transitionIncident(id, 'confirm');
  }

  resolve(id: number): void {
    this.store.transitionIncident(id, 'resolve');
  }

  cancelIncident(id: number): void {
    this.store.transitionIncident(id, 'cancel');
  }

  delete(id: number): void {
    this.store.deleteIncident(id);
  }
}
