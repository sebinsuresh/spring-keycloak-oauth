import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { AdminService, UserInformation } from "../../core/services/admin.service";
import { take } from "rxjs";

@Component({
    selector: "app-admin",
    templateUrl: "admin.html",
    styleUrl: "admin.scss",
    standalone: true,
})
export class Admin implements OnInit {
    private readonly service = inject(AdminService);
    private readonly changeDetector = inject(ChangeDetectorRef);

    userInformation: Array<UserInformation> | null = null;

    ngOnInit() {
        this.service.listUsers()
            .pipe(take(1))
            .subscribe((userInfo) => {
                this.userInformation = userInfo;
                this.changeDetector.detectChanges();
            });
    }
}
