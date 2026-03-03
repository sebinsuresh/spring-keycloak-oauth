import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs";

/**
 * Verified logged in by attempting to load current authenticated user.
 * Redirects to home if unauthenticated.
 */
export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated()) {
        return true;
    }

    return auth.loadUser().pipe(
        map((user) => {
            if (user === null) {
                router.navigate(["/"]);
                return false;
            }
            return true;
        }),
    );
};
