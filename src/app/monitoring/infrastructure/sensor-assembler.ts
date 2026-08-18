import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SensorResource, SensorsResponse } from './sensors-response';
import { Sensor } from '../domain/model/sensor.entity';
import { SensorType } from '../domain/model/sensor-type.value-object';
import { SensorStatus } from '../domain/model/sensor-status.value-object';

/**
 * Maps sensor infrastructure contracts to domain entities and back.
 */
export class SensorAssembler implements BaseAssembler<Sensor, SensorResource, SensorsResponse> {
  /**
   * Maps a sensor collection response envelope into domain entities.
   */
  toEntitiesFromResponse(response: SensorsResponse): Sensor[] {
    return response.sensors.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Maps one sensor resource contract into a domain entity.
   */
  toEntityFromResource(resource: SensorResource): Sensor {
    const typeValue = (resource.sensorType ?? (resource as any).type ?? 0) as SensorType;
    const statusValue = (resource.sensorStatus ?? (resource as any).status ?? 0) as SensorStatus;

    return new Sensor({
      id: resource.id,
      name: resource.name,
      type: typeValue,
      status: statusValue,
      location: resource.location,
      minThreshold: resource.minThreshold,
      maxThreshold: resource.maxThreshold,
      installedAt: new Date(resource.installedAt),
      lastReadingAt: resource.lastReadingAt ? new Date(resource.lastReadingAt) : null,
    });
  }

  /**
   * Maps one sensor domain entity into an infrastructure resource contract.
   */
  toResourceFromEntity(entity: Sensor): SensorResource {
    const statusValue = entity.status as number;
    const typeValue = entity.type as number;

    return {
      id: entity.id,
      name: entity.name,
      type: typeValue,
      status: statusValue,
      sensorType: typeValue,
      sensorStatus: statusValue,
      location: entity.location,
      minThreshold: entity.minThreshold,
      maxThreshold: entity.maxThreshold,
      installedAt: entity.installedAt.toISOString(),
      lastReadingAt: entity.lastReadingAt?.toISOString() ?? null,
    } as SensorResource;
  }
}
