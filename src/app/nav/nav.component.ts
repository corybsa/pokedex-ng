import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { Router } from "@angular/router";
import { Apollo } from "apollo-angular";
import { Observable } from "rxjs";
import { GenerationCache } from "../models/cache/generation-cache";
import { Generation } from "../models/util/generation.model";
import { GenerationsService } from "../services/generations.service";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    @ViewChild('drawer') drawer!: MatDrawer;

    generations: Observable<Generation[]>;

    get currentGen(): number {
        return this.generationCache.getGenerationId();
    }

    constructor(
        private router: Router,
        private apollo: Apollo,
        private generationService: GenerationsService,
        private generationCache: GenerationCache
    ) {
        this.generations = this.generationService.getGenerations();
    }

    ngOnInit(): void {
    }

    closeDrawer() {
        this.router.navigate([{ outlets: { nav: null } }]);
        this.drawer.close();
    }

    changeGeneration(genId: number) {
        this.generationCache.setGenerationId(genId);
        this.apollo.client.clearStore();
        this.apollo.client.resetStore();
        location.reload();
    }
}
