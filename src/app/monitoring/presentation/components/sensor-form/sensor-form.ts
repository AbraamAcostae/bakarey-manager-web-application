import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MonitoringStore } from '../../../application/monitoring.store';
import { SensorType } from '../../../domain/model/sensor-type.value-object';

/**
 * Lets the user register a new IoT sensor.
 */
@Component({
  selector: 'app-sensor-form',
  imports: [ReactiveFormsModule],
  templateUrl: './sensor-form.html',
  styleUrl: './sensor-form.css',
})
export class SensorForm {
  private readonly store = inject(MonitoringStore);
  private readonly fb = inject(FormBuilder);

  protected showForm = signal(false);
  protected typeOptions = [
    { value: SensorType.TEMPERATURE, label: 'Temperatura' },
    { value: SensorType.HUMIDITY, label: 'Humedad Relativa' },
    { value: SensorType.GAS, label: 'Gas' },
    { value: SensorType.SMOKE, label: 'Vapor' },
  ];

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    type: [SensorType.TEMPERATURE, [Validators.required]],
    location: ['', [Validators.required]],
    minThreshold: [0, [Validators.required]],
    maxThreshold: [100, [Validators.required]],
  });

  openForm(): void {
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { name, type, location, minThreshold, maxThreshold } = this.form.value;
    this.store.createSensor({
      name,
      type: Number(type),
      location,
      minThreshold: Number(minThreshold),
      maxThreshold: Number(maxThreshold),
    });
    this.form.reset({ type: SensorType.TEMPERATURE, minThreshold: 0, maxThreshold: 100 });
    this.showForm.set(false);
  }

  onCancel(): void {
    this.form.reset({ type: SensorType.TEMPERATURE, minThreshold: 0, maxThreshold: 100 });
    this.showForm.set(false);
  }
}
