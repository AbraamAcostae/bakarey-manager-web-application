import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { ProductionBatch } from '../domain/model/production-batch.entity';
import { BatchStatus } from '../domain/model/batch-status.value-object';
import { ProductionReport } from '../domain/model/production-report.entity';
import { Branch } from '../domain/model/branch.entity';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentStatus } from '../domain/model/equipment-status.value-object';
import { ProductionApi } from '../infrastructure/production-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Application-layer store that orchestrates Production use cases.
 *
 * @remarks
 * Coordinates infrastructure calls and projects results into reactive UI state.
 * Domain entities stay in the domain layer; API contracts stay in infrastructure.
 */
export class ProductionStore {
  private readonly batchesSignal = signal<ProductionBatch[]>([]);
  /** Readonly signal for the list of production batches. */
  readonly batches = this.batchesSignal.asReadonly();

  /** Readonly signal indicating if data is loading. */
  readonly loadingSignal = signal<boolean>(false);

  private readonly errorSignal = signal<string | null>(null);
  /** Readonly signal for the current error message. */
  readonly error = this.errorSignal.asReadonly();

  /** Count of active batches (PLANNED + IN_PROGRESS). */
  readonly activeBatchesCount = computed(
    () =>
      this.batches().filter(
        (b) => b.status === BatchStatus.PLANNED || b.status === BatchStatus.IN_PROGRESS,
      ).length,
  );
  /** Count of batches currently in progress. */
  readonly inProgressCount = computed(
    () => this.batches().filter((b) => b.status === BatchStatus.IN_PROGRESS).length,
  );
  /** Count of completed batches. */
  readonly completedCount = computed(
    () => this.batches().filter((b) => b.status === BatchStatus.COMPLETED).length,
  );
  /** Average production efficiency as a percentage (completed / closed). */
  readonly efficiency = computed(() => {
    const completed = this.completedCount();
    const cancelled = this.batches().filter((b) => b.status === BatchStatus.CANCELLED).length;
    const closed = completed + cancelled;
    return closed === 0 ? 0 : Math.round((completed / closed) * 100);
  });

  private readonly branchesSignal = signal<Branch[]>([]);
  /** Readonly signal for the list of active branches. */
  readonly branches = this.branchesSignal.asReadonly();

  private readonly equipmentSignal = signal<Equipment[]>([]);
  /** Readonly signal for the equipment of the currently selected branch. */
  readonly equipment = this.equipmentSignal.asReadonly();

  private readonly destroyRef = inject(DestroyRef);

  constructor(private productionApi: ProductionApi) {
    this.loadBatches();
    this.loadBranches();
  }

  /**
   * Selects a batch by identifier.
   * @param id Batch identifier.
   */
  getBatchById(id: number): Signal<ProductionBatch | undefined> {
    return computed(() => (id ? this.batches().find((b) => b.id === id) : undefined));
  }

  /**
   * Creates and plans a new production batch (US-81 / US-82).
   * @param data Batch planning data.
   */
  createBatch(data: {
    batchCode: string;
    productName: string;
    plannedQuantity: number;
    branchId: number;
    equipmentId: number;
  }): void {
    const batch = new ProductionBatch({
      id: 0,
      batchCode: data.batchCode,
      productName: data.productName,
      plannedQuantity: data.plannedQuantity,
      producedQuantity: 0,
      status: BatchStatus.PLANNED,
      branchId: data.branchId,
      equipmentId: data.equipmentId,
      startedAt: null,
      completedAt: null,
    });
    this.productionApi
      .createBatch(batch)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => this.batchesSignal.update((list) => [created, ...list]),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to create batch.')),
      });
  }

  /** Starts a batch via PATCH /api/v1/batches/{id}/start (US-83). */
  startBatch(id: number): void {
    this.productionApi.startBatch(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.batchesSignal.update((list) => list.map((b) => b.id === id ? updated : b)),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to start batch.')),
      });
  }

  /** Registers produced quantity (US-84). */
  registerProgress(id: number, quantity: number): void {
    const batch = this.batches().find((b) => b.id === id);
    if (!batch) return;
    batch.registerProgress(quantity);
    this.batchesSignal.update((list) => [...list]);
  }

  /** Completes a batch via PATCH /api/v1/batches/{id}/complete (US-85). */
  completeBatch(id: number): void {
    const producedQuantity = this.batches().find(b => b.id === id)?.plannedQuantity ?? 0;
    this.productionApi.completeBatch(id, producedQuantity)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.batchesSignal.update((list) => list.map((b) => b.id === id ? updated : b)),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to complete batch.')),
      });
  }

  /** Cancels a batch via PATCH /api/v1/batches/{id}/cancel (US-86). */
  cancelBatch(id: number): void {
    this.productionApi.cancelBatch(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.batchesSignal.update((list) => list.map((b) => b.id === id ? updated : b)),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to cancel batch.')),
      });
  }

  /**
   * Retrieves the production report for a branch via GET /api/v1/branches/{id}/report (US-91 / US-92).
   * @param branchId Branch the report is scoped to.
   */
  generateReport(branchId: number): Observable<ProductionReport> {
    return this.productionApi.getBranchReport(branchId);
  }

  /** Creates a new branch. */
  createBranch(name: string, location: string): void {
    this.productionApi
      .createBranch(new Branch({ id: 0, name, location, active: true }))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => this.branchesSignal.update((list) => [created, ...list]),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to create branch.')),
      });
  }

  /** Updates a branch's name and location. */
  updateBranch(branch: Branch): void {
    this.productionApi
      .updateBranch(branch)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.branchesSignal.update((list) => list.map((b) => (b.id === updated.id ? updated : b))),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to update branch.')),
      });
  }

  /** Activates or deactivates a branch. */
  patchBranchActive(id: number, active: boolean): void {
    this.productionApi
      .patchBranchActive(id, active)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.branchesSignal.update((list) => list.map((b) => (b.id === updated.id ? updated : b))),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to update branch status.')),
      });
  }

  /** Loads the equipment belonging to a branch. */
  loadEquipmentForBranch(branchId: number): void {
    this.productionApi
      .getEquipmentByBranch(branchId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (equipment) => this.equipmentSignal.set(equipment),
        error: () => this.equipmentSignal.set([]),
      });
  }

  /** Registers a new piece of equipment under a branch. */
  registerEquipment(name: string, serialNumber: string, branchId: number): void {
    this.productionApi
      .registerEquipment(name, serialNumber, branchId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => this.equipmentSignal.update((list) => [created, ...list]),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to register equipment.')),
      });
  }

  /** Updates the name and serial number of a piece of equipment. */
  updateEquipmentDetails(id: number, name: string, serialNumber: string): void {
    this.productionApi
      .updateEquipmentDetails(id, name, serialNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.equipmentSignal.update((list) => list.map((e) => (e.id === updated.id ? updated : e))),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to update equipment.')),
      });
  }

  /** Updates the operational status of a piece of equipment. */
  patchEquipmentStatus(id: number, status: EquipmentStatus): void {
    this.productionApi
      .patchEquipmentStatus(id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.equipmentSignal.update((list) => list.map((e) => (e.id === updated.id ? updated : e))),
        error: (err) => this.errorSignal.set(this.formatError(err, 'Failed to update equipment status.')),
      });
  }

  private loadBranches(): void {
    this.productionApi
      .getActiveBranches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (branches) => this.branchesSignal.set(branches),
        error: () => this.branchesSignal.set([]),
      });
  }

  private loadBatches(): void {
    this.loadingSignal.set(true);
    this.productionApi
      .getBatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (batches) => {
          this.batchesSignal.set(batches);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.batchesSignal.set([]);
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Normalizes unknown errors into a display-friendly message.
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
