import { BranchReportResource } from './branch-report-response';
import { ProductionReport } from '../domain/model/production-report.entity';

/**
 * Maps the branch report infrastructure contract into a domain entity.
 */
export class BranchReportAssembler {
  /**
   * Maps one branch report resource contract into a domain entity.
   */
  toEntityFromResource(resource: BranchReportResource): ProductionReport {
    const closed = resource.completedBatches + resource.cancelledBatches;
    return new ProductionReport({
      id: Date.now(),
      branchId: resource.branchId,
      generatedAt: new Date(),
      totalBatches: resource.totalBatches,
      completedBatches: resource.completedBatches,
      cancelledBatches: resource.cancelledBatches,
      efficiency: closed === 0 ? 0 : resource.completedBatches / closed,
    });
  }
}
