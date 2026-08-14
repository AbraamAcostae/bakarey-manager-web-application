import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BranchResource, BranchesResponse } from './branches-response';
import { Branch } from '../domain/model/branch.entity';

/**
 * Maps branch infrastructure contracts to domain entities and back.
 */
export class BranchAssembler implements BaseAssembler<Branch, BranchResource, BranchesResponse> {
  /**
   * Maps a branch collection response envelope into domain entities.
   */
  toEntitiesFromResponse(response: BranchesResponse): Branch[] {
    return response.branches.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Maps one branch resource contract into a domain entity.
   */
  toEntityFromResource(resource: BranchResource): Branch {
    return new Branch({
      id: resource.id,
      name: resource.name,
      location: resource.location,
      active: resource.active,
    });
  }

  /**
   * Maps one branch domain entity into an infrastructure resource contract.
   */
  toResourceFromEntity(entity: Branch): BranchResource {
    return {
      id: entity.id,
      name: entity.name,
      location: entity.location,
      active: entity.active,
    };
  }
}
