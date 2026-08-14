import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BranchReportResource } from './branch-report-response';
import { BranchReportAssembler } from './branch-report-assembler';
import { ProductionReport } from '../domain/model/production-report.entity';

const branchesEndpointUrl = `${environment.bakeryManagerProviderApiBaseUrl}${environment.productionProviderBranchesEndpointPath}`;

/**
 * Infrastructure endpoint client for the branch production report query.
 */
export class BranchReportApiEndpoint {
  constructor(
    private http: HttpClient,
    private assembler: BranchReportAssembler,
  ) {}

  /** GET /api/v1/branches/{branchId}/report */
  getByBranchId(branchId: number): Observable<ProductionReport> {
    return this.http.get<BranchReportResource>(`${branchesEndpointUrl}/${branchId}/report`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError((error) => {
        throw new Error(`Failed to fetch branch report: ${error.status ?? 'Unexpected error'}`);
      }),
    );
  }
}
