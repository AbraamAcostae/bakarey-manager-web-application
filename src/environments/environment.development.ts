/**
 * @summary Development environment configuration.
 * @author Abraam Acosta
 */
export const environment = {
  production: false,
  bakeryManagerProviderApiBaseUrl: 'http://localhost:3000/api/v1',
  productionProviderBatchesEndpointPath: '/productionBatches',
  productionProviderBranchesEndpointPath: '/productionLines',
  productionProviderEquipmentEndpointPath: '/products',
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1',
  platformProviderSignInEndpointPath: '/authentication',
  platformProviderSignUpEndpointPath: '/users',
  monitoringProviderIncidentsEndpointPath: '/incidents',
  monitoringProviderSensorsEndpointPath: '/sensors',
  monitoringProviderAlertsEndpointPath: '/alerts',
  inventoryProviderItemsEndpointPath: '/ingredients',
  inventoryProviderReportsEndpointPath: '/products',
};
