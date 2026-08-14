import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Infrastructure resource contract for branch payloads.
 */
export interface BranchResource extends BaseResource {
  id: number;
  name: string;
  location: string;
  active: boolean;
}

/**
 * Infrastructure response envelope used by branch collection queries.
 */
export interface BranchesResponse extends BaseResponse {
  branches: BranchResource[];
}
