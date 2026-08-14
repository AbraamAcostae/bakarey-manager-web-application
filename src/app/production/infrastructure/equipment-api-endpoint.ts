import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EquipmentResource } from './equipment-response';
import { EquipmentAssembler } from './equipment-assembler';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentStatus } from '../domain/model/equipment-status.value-object';

const equipmentEndpointUrl = `${environment.bakeryManagerProviderApiBaseUrl}${environment.productionProviderEquipmentEndpointPath}`;
const branchesEndpointUrl = `${environment.bakeryManagerProviderApiBaseUrl}${environment.productionProviderBranchesEndpointPath}`;

/**
 * Infrastructure endpoint client for equipment integration.
 *
 * @remarks
 * Equipment has no standalone "list all" endpoint — it is always listed
 * scoped to the branch that owns it, via `GET /api/v1/branches/{id}/equipment`.
 */
export class EquipmentApiEndpoint {
  constructor(
    private http: HttpClient,
    private assembler: EquipmentAssembler,
  ) {}

  /** GET /api/v1/branches/{branchId}/equipment */
  getByBranchId(branchId: number): Observable<Equipment[]> {
    return this.http.get<EquipmentResource[]>(`${branchesEndpointUrl}/${branchId}/equipment`).pipe(
      map((resources) => resources.map((resource) => this.assembler.toEntityFromResource(resource))),
      catchError(this.handleError('Failed to fetch branch equipment')),
    );
  }

  /** GET /api/v1/equipment/{id} */
  getById(id: number): Observable<Equipment> {
    return this.http.get<EquipmentResource>(`${equipmentEndpointUrl}/${id}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch equipment')),
    );
  }

  /** POST /api/v1/equipment */
  register(name: string, serialNumber: string, branchId: number): Observable<Equipment> {
    return this.http.post<EquipmentResource>(equipmentEndpointUrl, { name, serialNumber, branchId }).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to register equipment')),
    );
  }

  /** PUT /api/v1/equipment/{id} — updates name and serial number */
  updateDetails(id: number, name: string, serialNumber: string): Observable<Equipment> {
    return this.http.put<EquipmentResource>(`${equipmentEndpointUrl}/${id}`, { name, serialNumber }).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to update equipment')),
    );
  }

  /** PATCH /api/v1/equipment/{id} — updates operational status */
  patchStatus(id: number, status: EquipmentStatus): Observable<Equipment> {
    return this.http.patch<EquipmentResource>(`${equipmentEndpointUrl}/${id}`, { status }).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to update equipment status')),
    );
  }

  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      throw new Error(`${operation}: ${error.status ?? 'Unexpected error'}`);
    };
  }
}
