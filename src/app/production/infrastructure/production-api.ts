import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ProductionBatchesApiEndpoint } from './production-batches-api-endpoint';
import { BranchReportApiEndpoint } from './branch-report-api-endpoint';
import { BranchReportAssembler } from './branch-report-assembler';
import { BranchesApiEndpoint } from './branches-api-endpoint';
import { EquipmentApiEndpoint } from './equipment-api-endpoint';
import { EquipmentAssembler } from './equipment-assembler';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductionBatch } from '../domain/model/production-batch.entity';
import { ProductionReport } from '../domain/model/production-report.entity';
import { Branch } from '../domain/model/branch.entity';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentStatus } from '../domain/model/equipment-status.value-object';

@Injectable({
  providedIn: 'root',
})
/**
 * Infrastructure facade exposing Production bounded-context endpoint operations.
 */
export class ProductionApi extends BaseApi {
  private readonly batchesEndpoint: ProductionBatchesApiEndpoint;
  private readonly branchReportEndpoint: BranchReportApiEndpoint;
  private readonly branchesEndpoint: BranchesApiEndpoint;
  private readonly equipmentEndpoint: EquipmentApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.batchesEndpoint = new ProductionBatchesApiEndpoint(http);
    this.branchReportEndpoint = new BranchReportApiEndpoint(http, new BranchReportAssembler());
    this.branchesEndpoint = new BranchesApiEndpoint(http);
    this.equipmentEndpoint = new EquipmentApiEndpoint(http, new EquipmentAssembler());
  }

  /**
   * Retrieves all production batches.
   * @returns Stream with the batch collection.
   */
  getBatches(): Observable<ProductionBatch[]> {
    return this.batchesEndpoint.getAll();
  }

  /**
   * Retrieves a single production batch by ID.
   * @param id The ID of the batch.
   */
  getBatch(id: number): Observable<ProductionBatch> {
    return this.batchesEndpoint.getById(id);
  }

  /**
   * Persists a new production batch.
   * @param batch The batch to create.
   */
  createBatch(batch: ProductionBatch): Observable<ProductionBatch> {
    return this.batchesEndpoint.create(batch);
  }

  /** PATCH /api/v1/batches/{id} — status: IN_PROGRESS */
  startBatch(id: number): Observable<ProductionBatch> {
    return this.batchesEndpoint.start(id);
  }

  /** PATCH /api/v1/batches/{id} — status: COMPLETED */
  completeBatch(id: number, producedQuantity: number): Observable<ProductionBatch> {
    return this.batchesEndpoint.complete(id, producedQuantity);
  }

  /** PATCH /api/v1/batches/{id} — status: CANCELLED */
  cancelBatch(id: number): Observable<ProductionBatch> {
    return this.batchesEndpoint.cancel(id);
  }

  /**
   * Retrieves the production report for a branch.
   * @param branchId The ID of the branch.
   */
  getBranchReport(branchId: number): Observable<ProductionReport> {
    return this.branchReportEndpoint.getByBranchId(branchId);
  }

  /** GET /api/v1/branches — lists active branches */
  getActiveBranches(): Observable<Branch[]> {
    return this.branchesEndpoint.getAll();
  }

  /** GET /api/v1/branches/{id} */
  getBranch(id: number): Observable<Branch> {
    return this.branchesEndpoint.getById(id);
  }

  /** POST /api/v1/branches */
  createBranch(branch: Branch): Observable<Branch> {
    return this.branchesEndpoint.create(branch);
  }

  /** PUT /api/v1/branches/{id} */
  updateBranch(branch: Branch): Observable<Branch> {
    return this.branchesEndpoint.update(branch, branch.id);
  }

  /** PATCH /api/v1/branches/{id} — activates or deactivates the branch */
  patchBranchActive(id: number, active: boolean): Observable<Branch> {
    return this.branchesEndpoint.patchActive(id, active);
  }

  /** GET /api/v1/branches/{id}/equipment */
  getEquipmentByBranch(branchId: number): Observable<Equipment[]> {
    return this.equipmentEndpoint.getByBranchId(branchId);
  }

  /** POST /api/v1/equipment */
  registerEquipment(name: string, serialNumber: string, branchId: number): Observable<Equipment> {
    return this.equipmentEndpoint.register(name, serialNumber, branchId);
  }

  /** PUT /api/v1/equipment/{id} */
  updateEquipmentDetails(id: number, name: string, serialNumber: string): Observable<Equipment> {
    return this.equipmentEndpoint.updateDetails(id, name, serialNumber);
  }

  /** PATCH /api/v1/equipment/{id} — updates operational status */
  patchEquipmentStatus(id: number, status: EquipmentStatus): Observable<Equipment> {
    return this.equipmentEndpoint.patchStatus(id, status);
  }
}
