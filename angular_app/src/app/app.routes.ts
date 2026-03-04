import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Profile } from './features/profile/profile';
import { Home } from './features/home/home';
import { Admin } from './features/admin/admin';

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
        path: "admin",
        // TODO: add admin guard
        canActivate: [authGuard],
        component: Admin,
    },
    {
        path: "**",
        redirectTo: "",
    },
];
