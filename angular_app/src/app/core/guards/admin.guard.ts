import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Verifies admin role. Redirects to home if unauthenticated.
 */
export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.isAdmin() ?
        true :
        router.createUrlTree(["/"]);
};