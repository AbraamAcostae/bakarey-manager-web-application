import { Routes } from '@angular/router';

const signInForm = () => import('./views/sign-in-form/sign-in-form').then(m => m.SignInForm);
const signUpForm = () => import('./views/sign-up-form/sign-up-form').then(m => m.SignUpForm);
const profileSettings = () => import('./views/profile-settings/profile-settings').then(m => m.ProfileSettings);

/**
 * Route tree for IAM presentation views.
 * @author Abraam Acosta
 */
export const iamRoutes: Routes = [
  { path: 'sign-in', loadComponent: signInForm },
  { path: 'sign-up', loadComponent: signUpForm },
  { path: 'profile', loadComponent: profileSettings }
];
