import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    if (authService.hasRole(allowedRoles)) {
      return true;
    }

    // Redirection selon le rôle réel
    const currentRole = authService.currentRole();
    switch (currentRole) {
      case Role.PARENT:
        return router.createUrlTree(['/parent/dashboard']);
      case Role.MEDECIN:
        return router.createUrlTree(['/medecin/dashboard']);
      case Role.SUPERVISEUR:
        return router.createUrlTree(['/superviseur/tour-de-controle']);
      case Role.ADMINISTRATEUR:
        return router.createUrlTree(['/admin/dashboard']);
      case Role.AGENT_SANTE:
        return router.createUrlTree(['/agent/tour-de-controle']);
      default:
        return router.createUrlTree(['/login']);
    }
  };
};
