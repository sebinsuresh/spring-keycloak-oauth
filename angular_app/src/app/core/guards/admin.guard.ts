import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs";

export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    // Exit early if we're already logged in & an admin
    if (auth.isAdmin()) {
        return true;
    }

    // To handle browser refresh / direct-link case if user is logged in,
    // need to try loading user.
    return auth.loadUser().pipe(
        map(() => auth.isAdmin() ? true : router.createUrlTree(["/"]))
    );
};