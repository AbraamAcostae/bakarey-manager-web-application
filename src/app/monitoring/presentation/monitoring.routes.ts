import { Routes } from '@angular/router';

const dashboard = () => import('./views/dashboard/dashboard').then((m) => m.Dashboard);

/**
 * Route tree for monitoring presentation views.
 */
export const monitoringRoutes: Routes = [
  { path: 'dashboard', loadComponent: dashboard },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
