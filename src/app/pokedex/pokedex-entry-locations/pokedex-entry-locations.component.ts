import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { VersionLocationEncounter } from 'src/app/models/location/version-location-encounter.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-pokedex-entry-locations',
  templateUrl: './pokedex-entry-locations.component.html',
  styleUrls: ['./pokedex-entry-locations.component.css']
})
export class PokedexEntryLocationsComponent implements OnInit, OnChanges {
  @Input() pokemon!: Pokemon;

  encounters: VersionLocationEncounter[] = [];

  constructor(
    private service: LocationService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if(this.pokemon) {
      this.service.getPokemonLocations(this.pokemon.id).subscribe(res => this.encounters = res);
    }
  }
}
