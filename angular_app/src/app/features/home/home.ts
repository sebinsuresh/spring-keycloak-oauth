import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.html',
    styleUrl: 'home.scss',
    standalone: true,
})
export class Home {
    readonly auth = inject(AuthService);
}
