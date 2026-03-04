import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs";

/**
 * Verified logged in by attempting to load current authenticated user.
 * Redirects to home if unauthenticated.
 * Returns an observable so that direct URL navigation (full page reload)
 * waits for the async /api/user/me response before evaluating access.
 */
export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    // Exit early if we're already logged in
    if (auth.isAuthenticated()) {
        return true;
    }

    // To handle browser refresh / direct-link case if user is logged in,
    // need to try loading user.
    return auth.loadUser().pipe(
        map(() => auth.isAuthenticated() ? true : router.createUrlTree(["/"]))
    );
};
