import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { TypeRelations } from '../models/pokemon/type-relations.model';
import { Type } from '../models/pokemon/type.model';
import { Helper } from '../models/util/helper';
import { PokedexService } from '../services/pokedex.service';
import { PokemonTypesService } from '../services/pokemon-types.service';
import * as _ from 'underscore';
import { PokemonTypes } from '../models/util/pokemon-types.model';

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
    private typesService: PokemonTypesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const id = +this.route.snapshot.params['id'];
    this.service.getPokemon(id).subscribe(p => {
      this.pokemon = p;
      const type1 = Helper.getIdFromUrl(this.pokemon.types[0]?.type.url);
      const type2 = Helper.getIdFromUrl(this.pokemon.types[1]?.type.url);
      this.getDamageRelations(type1, type2);
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

  getDamageRelations(type1: number, type2: number) {
    const subs: Observable<Type>[] = [];

    if(type1) {
      subs.push(this.typesService.getType(type1));
    }

    if(type2) {
      subs.push(this.typesService.getType(type2));
    }

    concat(...subs).pipe(
      finalize(() => {
        this.calculateWeaknesses();
        this.calculateStrengths();
      })
    ).subscribe(res => this.damageRelations.push(res.damage_relations));
  }

  calculateWeaknesses() {
    // TODO: edge cases for ghost, dragon, etc...

    // pokemon has two types
    if(this.damageRelations.length === 2) {
      const pokemonType1 = this.pokemon.types[0].type.name;
      const pokemonType2 = this.pokemon.types[1].type.name;

      let halfDamage = _.pluck(_.union(this.damageRelations[0].half_damage_from, this.damageRelations[1].half_damage_from), 'name');
      let doubleDamage = _.pluck(_.union(this.damageRelations[0].double_damage_from, this.damageRelations[1].double_damage_from), 'name');
      
      // this.normalDamageFrom = _.intersection(halfDamage, doubleDamage);
      this.halfDamageFrom = _.without(halfDamage, ...doubleDamage);
      this.quarterDamageFrom = _.intersection(this.halfDamageFrom, [pokemonType1, pokemonType2]);
      this.halfDamageFrom = _.without(this.halfDamageFrom, ...this.quarterDamageFrom);
      this.doubleDamageFrom = _.without(doubleDamage, ...halfDamage);
      this.normalDamageFrom = _.difference(PokemonTypes.Types, this.halfDamageFrom, this.doubleDamageFrom, this.quarterDamageFrom);
    } else {
      this.halfDamageFrom = _.pluck(this.damageRelations[0].half_damage_from, 'name');
      this.doubleDamageFrom = _.pluck(this.damageRelations[0].double_damage_from, 'name');
      this.normalDamageFrom = _.difference(PokemonTypes.Types, this.halfDamageFrom, this.doubleDamageFrom);
    }
  }

  calculateStrengths() {
    if(this.damageRelations.length === 2) {
      
    }
  }
}
