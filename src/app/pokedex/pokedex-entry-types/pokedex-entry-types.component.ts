import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PokemonTypeEfficacies } from 'src/app/models/pokemon/pokemon-type-efficacies.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { PokemonTypesService } from 'src/app/services/pokemon-types.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-pokedex-entry-types',
  templateUrl: './pokedex-entry-types.component.html',
  styleUrls: ['./pokedex-entry-types.component.css']
})
export class PokedexEntryTypesComponent implements OnInit, OnChanges {
  @Input() pokemon!: Pokemon;
  types: PokemonTypeEfficacies = {
    pokemonId: -1,
    zeroDamage: [],
    quarterDamage: [],
    halfDamage: [],
    normalDamage: [],
    doubleDamage: [],
    quadDamage: []
  };

  constructor(
    private service: PokemonTypesService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if(this.pokemon) {
      this.service.getTypeEfficacies(this.pokemon.id).subscribe(res => this.types = res);
    }
  }

  doSomethingWithTypes(id: number) {
    console.log(id);
  }
}
