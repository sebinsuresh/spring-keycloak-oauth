import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { catchError, Observable, of, shareReplay, tap } from "rxjs";

export interface UserProfile {
    name: string;
    email: string;
    claims: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);

    private readonly _user = signal<UserProfile | null>(null);
    // Cached observable so that multiple subscribers (app.ts + authGuard)
    // never trigger more than one HTTP request.
    private _loadUser$: Observable<UserProfile | null> | null = null;

    readonly user = this._user.asReadonly();
    readonly isAuthenticated = computed(() => this._user() !== null);

    /**
     * Fetch the current user from /api/me and populate auth state.
     */
    loadUser(): Observable<UserProfile | null> {
        if (!this._loadUser$) {
            this._loadUser$ = this.http.get<UserProfile>("/api/me").pipe(
                tap(user => this._user.set(user)),
                catchError((err) => {
                    console.error(err);
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
        window.location.href = "/api/logout";
    }
}
