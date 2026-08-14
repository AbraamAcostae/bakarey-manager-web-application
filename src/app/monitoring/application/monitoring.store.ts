import { computed, Injectable, Signal, signal } from '@angular/core';
import { Sensor } from '../domain/model/sensor.entity';
import { SensorType } from '../domain/model/sensor-type.value-object';
import { SensorStatus } from '../domain/model/sensor-status.value-object';
import { Incident } from '../domain/model/incident.entity';
import { IncidentStatus } from '../domain/model/incident-status.value-object';
import { Alert } from '../domain/model/alert.entity';
import { AlertSeverity } from '../domain/model/alert-severity.value-object';
import { MonitoringApi } from '../infrastructure/monitoring-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
/**
 * Application-layer store that orchestrates IoT Monitoring use cases.
 *
 * @remarks
 * This type coordinates infrastructure calls and projects results into reactive
 * UI state. Domain entities stay in the domain layer while API contracts stay
 * in infrastructure.
 */
export class MonitoringStore {
  /** Computed signal for the count of sensors **/
  readonly sensorCount = computed(() => this.sensors().length);
  /** Computed signal for the count of incidents **/
  readonly incidentCount = computed(() => this.incidents().length);
  /** Computed signal for the count of alerts **/
  readonly alertCount = computed(() => this.alerts().length);

  private readonly sensorsSignal = signal<Sensor[]>([]);
  /** Readonly signal for the list of sensors **/
  readonly sensors = this.sensorsSignal.asReadonly();

  private readonly incidentsSignal = signal<Incident[]>([]);
  /** Readonly signal for the list of incidents **/
  readonly incidents = this.incidentsSignal.asReadonly();

  private readonly alertsSignal = signal<Alert[]>([]);
  /** Readonly signal for the list of alerts **/
  readonly alerts = this.alertsSignal.asReadonly();

  /** Readonly signal indicating if data is loading **/
  readonly loadingSignal = signal<boolean>(false);

  private readonly errorSignal = signal<string | null>(null);
  /** Readonly signal for the current error message **/
  readonly error = this.errorSignal.asReadonly();

  /**
   * Creates an instance of MonitoringStore and loads initial data.
   * @param monitoringApi The API service for monitoring data.
   */
  constructor(private monitoringApi: MonitoringApi) {
    this.loadSensors();
    this.loadIncidents();
    this.loadAlerts();
  }

  /**
   * Selects a sensor by identifier.
   * @param id Sensor identifier
   */
  getSensorById(id: number): Signal<Sensor | undefined> {
    return computed(() => (id ? this.sensors().find((s) => s.id === id) : undefined));
  }

  /**
   * Selects an incident by identifier.
   * @param id Incident identifier
   */
  getIncidentById(id: number): Signal<Incident | undefined> {
    return computed(() => (id ? this.incidents().find((i) => i.id === id) : undefined));
  }

  /**
   * Selects an alert by identifier.
   * @param id Alert identifier
   */
  getAlertById(id: number): Signal<Alert | undefined> {
    return computed(() => (id ? this.alerts().find((a) => a.id === id) : undefined));
  }

  /** Registers a new sensor. */
  createSensor(data: { name: string; type: SensorType; location: string; minThreshold: number; maxThreshold: number }): void {
    const sensor = new Sensor({
      id: 0,
      name: data.name,
      type: data.type,
      status: SensorStatus.ACTIVE,
      location: data.location,
      minThreshold: data.minThreshold,
      maxThreshold: data.maxThreshold,
      installedAt: new Date(),
      lastReadingAt: null,
    });
    this.monitoringApi
      .createSensor(sensor)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (created) => this.sensorsSignal.update((list) => [created, ...list]),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to create sensor.')),
      });
  }

  /** Toggles a sensor's active status. */
  toggleSensorStatus(id: number): void {
    const sensor = this.sensors().find((s) => s.id === id);
    if (!sensor) return;
    sensor.status = sensor.status === SensorStatus.ACTIVE ? SensorStatus.INACTIVE : SensorStatus.ACTIVE;
    this.monitoringApi
      .updateSensor(sensor)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (updated) => this.sensorsSignal.update((list) => list.map((s) => (s.id === updated.id ? updated : s))),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to update sensor.')),
      });
  }

  /** Deletes a sensor. */
  deleteSensor(id: number): void {
    this.monitoringApi
      .deleteSensor(id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.sensorsSignal.update((list) => list.filter((s) => s.id !== id)),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to delete sensor.')),
      });
  }

  /** Registers a new incident. */
  createIncident(title: string, description: string): void {
    const incident = new Incident({
      id: 0,
      title,
      description,
      status: IncidentStatus.OPEN,
      detectedAt: new Date(),
      confirmedAt: null,
      resolvedAt: null,
      canceledAt: null,
    });
    this.monitoringApi
      .createIncident(incident)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (created) => this.incidentsSignal.update((list) => [created, ...list]),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to create incident.')),
      });
  }

  /** Transitions an incident's status (confirm, resolve or cancel). */
  transitionIncident(id: number, transition: 'confirm' | 'resolve' | 'cancel'): void {
    const incident = this.incidents().find((i) => i.id === id);
    if (!incident) return;
    incident[transition]();
    this.monitoringApi
      .updateIncident(incident)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (updated) => this.incidentsSignal.update((list) => list.map((i) => (i.id === updated.id ? updated : i))),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to update incident.')),
      });
  }

  /** Deletes an incident. */
  deleteIncident(id: number): void {
    this.monitoringApi
      .deleteIncident(id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.incidentsSignal.update((list) => list.filter((i) => i.id !== id)),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to delete incident.')),
      });
  }

  /** Registers a new alert. */
  createAlert(message: string, severity: AlertSeverity): void {
    const alert = new Alert({ id: 0, message, severity, isRead: false, generatedAt: new Date() });
    this.monitoringApi
      .createAlert(alert)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (created) => this.alertsSignal.update((list) => [created, ...list]),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to create alert.')),
      });
  }

  /** Marks an alert as read. */
  markAlertAsRead(id: number): void {
    const alert = this.alerts().find((a) => a.id === id);
    if (!alert) return;
    alert.markAsRead();
    this.monitoringApi
      .updateAlert(alert)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (updated) => this.alertsSignal.update((list) => list.map((a) => (a.id === updated.id ? updated : a))),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to update alert.')),
      });
  }

  /** Deletes an alert. */
  deleteAlert(id: number): void {
    this.monitoringApi
      .deleteAlert(id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.alertsSignal.update((list) => list.filter((a) => a.id !== id)),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to delete alert.')),
      });
  }

  /**
   * Loads all sensors from the API.
   * @private
   */
  private loadSensors(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.monitoringApi
      .getSensors()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (sensors) => {
          this.sensorsSignal.set(sensors);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load sensors.'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all incidents from the API.
   * @private
   */
  private loadIncidents(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.monitoringApi
      .getIncidents()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (incidents) => {
          this.incidentsSignal.set(incidents);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load incidents.'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all alerts from the API.
   * @private
   */
  private loadAlerts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.monitoringApi
      .getAlerts()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (alerts) => {
          this.alertsSignal.set(alerts);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load alerts.'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Normalizes unknown errors into a display-friendly message.
   * @param error Source error.
   * @param fallback Default message when details are unavailable.
   * @returns Normalized message.
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}
