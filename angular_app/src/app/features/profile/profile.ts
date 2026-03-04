import { Component, inject } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.html',
    styleUrl: 'profile.scss',
    standalone: true,
})
export class Profile {
    readonly auth = inject(AuthService);
}
