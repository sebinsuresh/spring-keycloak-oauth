import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { catchError, Observable, of, shareReplay, tap } from "rxjs";

export interface UserProfile {
    name: string;
    email: string;
}

export interface UserData extends UserProfile {
    claims: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);

    private readonly _userData = signal<UserData | null>(null);
    // Cached observable so that multiple subscribers (app.ts + authGuard)
    // never trigger more than one HTTP request.
    private _loadUser$: Observable<UserProfile | null> | null = null;

    readonly user: Signal<UserProfile | null> = computed(() => {
        if (this._userData() === null) {
            return null;
        }
        return {
            name: this._userData()!.name,
            email: this._userData()!.email,
        }
    });

    readonly isAuthenticated = computed(() => this._userData() !== null);

    readonly isAdmin = computed(() => {
        if (this._userData() === null) {
            return false;
        }
        return this.checkUserIsAdmin(this._userData());
    });

    /**
     * Fetch the current user from `/api/me` and populate auth state.
     */
    loadUser(): Observable<UserProfile | null> {
        if (!this._loadUser$) {
            this._loadUser$ = this.http.get<UserData>("/api/user/me").pipe(
                tap(userData => {
                    this._userData.set(userData);
                }),
                catchError((err) => {
                    if (err.status === 401) {
                        console.debug("/me endpoint failed - not logged in");
                    } else {
                        console.error(err);
                    }
                    this._userData.set(null);
                    return of(null);
                }),
                shareReplay(1),
            );
        }
        return this._loadUser$;
    }

    /**
     * Redirect browser to OIDC login page.
     */
    login() {
        window.location.href = "/api/oauth2/authorization/keycloak";
    }

    /**
     * Navigates the browser to the BFF logout endpoint.
     */
    logout() {
        this._loadUser$ = null;
        this._userData.set(null);
        window.location.href = "/api/logout";
    }

    private checkUserIsAdmin(userData: UserData | null): boolean {
        const realmAccess = userData?.claims["realm_access"];
        if (!realmAccess ||
            typeof realmAccess !== "object" ||
            !("roles" in realmAccess) ||
            !Array.isArray(realmAccess.roles)
        ) {
            return false;
        }
        return realmAccess.roles.includes("admin");
    }
}
