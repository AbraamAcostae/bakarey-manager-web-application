/**
 * @summary Production environment configuration.
 * @author Abraam Acosta
 */
export const environment = {
  production: true,
  bakeryManagerProviderApiBaseUrl: 'https://bakery-manager-platform-1.onrender.com/api/v1',
  productionProviderBatchesEndpointPath: '/batches',
  productionProviderBranchesEndpointPath: '/branches',
  productionProviderEquipmentEndpointPath: '/equipment',
  platformProviderApiBaseUrl: 'https://bakery-manager-platform-1.onrender.com/api/v1',
  platformProviderSignInEndpointPath: '/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/authentication/sign-up',
  monitoringProviderIncidentsEndpointPath: '/incidents',
  monitoringProviderSensorsEndpointPath: '/sensors',
  monitoringProviderAlertsEndpointPath: '/alerts',
  inventoryProviderItemsEndpointPath: '/inventory-items',
  inventoryProviderReportsEndpointPath: '/inventory/reports',
};
