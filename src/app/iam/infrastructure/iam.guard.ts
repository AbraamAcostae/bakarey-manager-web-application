import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../application/iam.store';
import { inject } from '@angular/core';

/**
 * Blocks protected routes when no authenticated IAM session exists.
 * @author Abraam Acosta
 */
export const iamGuard: CanActivateFn = () => {
  const store = inject(IamStore);
  const router = inject(Router);
  if (store.isSignedIn()) return true;
  else {
    router.navigate(['/sign-in']).then();
    return false;
  }
};
