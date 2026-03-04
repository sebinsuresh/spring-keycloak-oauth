import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Profile } from './features/profile/profile';
import { Home } from './features/home/home';
import { Admin } from './features/admin/admin';
import { adminGuard } from './core/guards/admin.guard';

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
        // TODO: Visiting URL manually not working
        canActivate: [authGuard, adminGuard],
        component: Admin,
    },
    {
        path: "**",
        redirectTo: "",
    },
];
