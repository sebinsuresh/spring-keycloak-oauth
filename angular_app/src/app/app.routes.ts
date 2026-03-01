import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Profile } from './features/profile/profile';
import { Home } from './features/home/home';

export const routes: Routes = [
    {
        path: "",
        component: Home,
    },
    {
        path: "profile",
        canActivate: [authGuard],
        component: Profile,
    },
    {
        path: "**",
        redirectTo: "",
    },
];
