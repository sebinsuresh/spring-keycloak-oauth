import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: 'app.html',
  styleUrl: 'app.scss',
})
export class App implements OnInit {
  readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.loadUser().pipe(
      take(1),
    ).subscribe();
  }

  logout() {
    this.auth.logout();
  }
}
