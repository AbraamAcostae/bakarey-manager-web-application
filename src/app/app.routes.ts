import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';
import { iamGuard } from './iam/infrastructure/iam.guard';

const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const productionRoutes = () =>
  import('./production/presentation/production.routes').then((m) => m.productionRoutes);
const monitoringRoutes = () =>
  import('./monitoring/presentation/monitoring.routes').then((m) => m.monitoringRoutes);
const inventoryRoutes = () =>
  import('./inventory/presentation/inventory.routes').then((m) => m.inventoryRoutes);
const signIn = () =>
  import('./iam/presentation/views/sign-in-form/sign-in-form').then((m) => m.SignInForm);
const signUp = () =>
  import('./iam/presentation/views/sign-up-form/sign-up-form').then((m) => m.SignUpForm);
const profileSettings = () =>
  import('./iam/presentation/views/profile-settings/profile-settings').then((m) => m.ProfileSettings);

const baseTitle = 'BakeryManager';

export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home`, canActivate: [iamGuard] },
  { path: 'profile', loadComponent: profileSettings, title: `${baseTitle} - Profile`, canActivate: [iamGuard] },
  { path: 'production', loadChildren: productionRoutes, canActivate: [iamGuard] },
  { path: 'monitoring', loadChildren: monitoringRoutes, canActivate: [iamGuard] },
  { path: 'inventory', loadChildren: inventoryRoutes, canActivate: [iamGuard] },
  { path: 'sign-in', loadComponent: signIn, title: `${baseTitle} - Sign In` },
  { path: 'sign-up', loadComponent: signUp, title: `${baseTitle} - Sign Up` },
  { path: 'about', loadComponent: about, title: `${baseTitle} - About` },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
