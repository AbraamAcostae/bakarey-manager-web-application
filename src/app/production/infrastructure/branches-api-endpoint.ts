import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Branch } from '../domain/model/branch.entity';
import { BranchResource, BranchesResponse } from './branches-response';
import { BranchAssembler } from './branch-assembler';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const branchesEndpointUrl = `${environment.bakeryManagerProviderApiBaseUrl}${environment.productionProviderBranchesEndpointPath}`;

/**
 * Infrastructure endpoint client for branch CRUD integration.
 */
export class BranchesApiEndpoint extends BaseApiEndpoint<Branch, BranchResource, BranchesResponse, BranchAssembler> {
  constructor(http: HttpClient) {
    super(http, branchesEndpointUrl, new BranchAssembler());
  }

  /** PATCH /api/v1/branches/{id} — activates or deactivates a branch */
  patchActive(id: number, active: boolean): Observable<Branch> {
    return this.http.patch<BranchResource>(`${this.endpointUrl}/${id}`, { active }).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to update branch status')),
    );
  }
}
