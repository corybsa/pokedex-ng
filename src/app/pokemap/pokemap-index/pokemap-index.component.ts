import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Location } from 'src/app/models/location/location.model';
import { Region } from 'src/app/models/location/region.model';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-pokemap-index',
  templateUrl: './pokemap-index.component.html',
  styleUrls: ['./pokemap-index.component.css']
})
export class PokemapIndexComponent implements OnInit {
  regions: Region[] = [];
  myControl = new FormControl();

  constructor(
    private service: LocationService,
    private router: Router
  ) {
    this.service.getRegions().subscribe(res => this.regions = res);
  }

  ngOnInit(): void {
  }

  displayItem(location: Location) {
    return location && location.name ? location.name : '';
  }

  locationSelected(e: MatAutocompleteSelectedEvent, region: Region) {
    localStorage.setItem('selectedRegion', JSON.stringify(region));
    this.router.navigate(['pokemap', e.option.value.id]);
  }
}
