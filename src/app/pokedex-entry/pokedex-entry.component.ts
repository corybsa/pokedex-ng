import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { TypeRelations } from '../models/pokemon/type-relations.model';
import { Helper } from '../models/util/helper';
import { PokedexService } from '../services/pokedex.service';
import { PokemonTypesService } from '../services/pokemon-types.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-pokedex-entry',
  templateUrl: './pokedex-entry.component.html',
  styleUrls: ['./pokedex-entry.component.css']
})
export class PokedexEntryComponent implements OnInit {
  pokemon!: Pokemon;
  damageRelations: TypeRelations[] = [];
  quarterDamageFrom: string[] = [];
  halfDamageFrom: string[] = [];
  normalDamageFrom: string[] = [];
  doubleDamageFrom: string[] = [];

  constructor(
    private service: PokedexService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const id = +this.route.snapshot.params['id'];
    this.service.getPokemon(id).subscribe(p => {
      this.pokemon = p;
    });
  }

  ngOnInit(): void {
  }

  capitalizeFirstLetter(str: string) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  back() {
    this.router.navigate(['/']);
  }

  convertToFeet(height: number) {
    const res = (12 * ((height * 0.3281) - Math.floor(height * 0.3281))).toFixed(1).split('.');
    return `${res[0]}' ${res[1]}"`;
  }

  convertToPounds(weight: number) {
    return (weight * 0.2205).toFixed(1);
  }
}
