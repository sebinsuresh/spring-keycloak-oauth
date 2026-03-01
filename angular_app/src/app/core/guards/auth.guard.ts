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

    // loadUser() is cached — if app.ts already initiated it, this reuses
    // the same in-flight observable and no second HTTP request is made.
    return auth.loadUser().pipe(
        map((user) => {
            if (user === null) {
                // Explicitly navigate home so the router doesn't leave the
                // outlet empty after cancelling the guarded route.
                router.navigate(["/"]);
                return false;
            }
            return true;
        }),
    );
};
