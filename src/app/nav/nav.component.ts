import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { Router } from "@angular/router";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    @ViewChild('drawer') drawer!: MatDrawer;

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    closeDrawer() {
        this.router.navigate([{ outlets: { nav: null } }]);
        this.drawer.close();
    }
}
