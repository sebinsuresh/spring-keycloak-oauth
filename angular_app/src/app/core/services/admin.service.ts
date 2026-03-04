import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, of, shareReplay } from "rxjs";

export interface UserInformation {
    userName: string,
    fullName: string,
}

@Injectable({
    providedIn: "root",
})
export class AdminService {
    private readonly _http = inject(HttpClient);
    private _userInfo$: Observable<Array<UserInformation> | null> | null = null;

    listUsers(): Observable<Array<UserInformation> | null> {
        if (!this._userInfo$) {
            this._userInfo$ = this._http
                .get<Array<UserInformation>>("/api/admin/listusers")
                .pipe(
                    catchError(err => {
                        console.error(
                            "/admin/listusers endpoint failed with error",
                            err
                        );
                        return of(null);
                    }),
                    shareReplay(1),
                );
        }
        return this._userInfo$;
    }
}
