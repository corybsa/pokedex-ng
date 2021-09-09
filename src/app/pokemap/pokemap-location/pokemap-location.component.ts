import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationEncounter } from 'src/app/models/location/location-encounter.model';
import { Region } from 'src/app/models/location/region.model';
import { VersionLocationEncounter } from 'src/app/models/location/version-location-encounter.model';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-pokemap-location',
  templateUrl: './pokemap-location.component.html',
  styleUrls: ['./pokemap-location.component.css']
})
export class PokemapLocationComponent implements OnInit {
  encounters: VersionLocationEncounter[] = [];
  region!: Region;

  constructor(
    private service: LocationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(values => {
      this.getRegion(+values.regionId);
      this.getLocationEncounters(+values.locationId);
    });
  }

  ngOnInit(): void {
  }

  getRegion(id: number) {
    this.service.getRegions().subscribe(res => {
      this.region = res.find(item => item.id === id)!;
    });
  }

  getLocationEncounters(id: number) {
    this.service.getLocationEncounters(id).subscribe(res => this.encounters = res);
  }

  back() {
    this.router.navigate(['pokemap']);
  }
}
