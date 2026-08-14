import { EquipmentResource } from './equipment-response';
import { Equipment } from '../domain/model/equipment.entity';
import { EquipmentStatus } from '../domain/model/equipment-status.value-object';

/**
 * Maps equipment infrastructure contracts to domain entities.
 */
export class EquipmentAssembler {
  /**
   * Maps one equipment resource contract into a domain entity.
   */
  toEntityFromResource(resource: EquipmentResource): Equipment {
    return new Equipment({
      id: resource.id,
      name: resource.name,
      serialNumber: resource.serialNumber,
      status: resource.status as EquipmentStatus,
    });
  }
}
