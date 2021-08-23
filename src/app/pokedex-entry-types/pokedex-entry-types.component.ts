import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { concat, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { TypeRelations } from '../models/pokemon/type-relations.model';
import { Type } from '../models/pokemon/type.model';
import { PokemonTypes } from '../models/util/pokemon-types.model';
import { PokemonTypesService } from '../services/pokemon-types.service';
import * as _ from 'underscore';
import { Helper } from '../models/util/helper';

@Component({
  selector: 'app-pokedex-entry-types',
  templateUrl: './pokedex-entry-types.component.html',
  styleUrls: ['./pokedex-entry-types.component.css']
})
export class PokedexEntryTypesComponent implements OnInit, OnChanges {
  @Input() pokemon!: Pokemon;
  damageRelations: TypeRelations[] = [];
  quarterDamageFrom: string[] = [];
  halfDamageFrom: string[] = [];
  normalDamageFrom: string[] = [];
  doubleDamageFrom: string[] = [];
  quadDamageFrom: string[] = [];
  noDamageFrom: string[] = [];

  constructor(
    private typesService: PokemonTypesService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if(this.pokemon) {
      const type1 = Helper.getIdFromUrl(this.pokemon.types[0]?.type.url);
      const type2 = Helper.getIdFromUrl(this.pokemon.types[1]?.type.url);
      this.getDamageRelations(type1, type2);
    }
  }

  capitalizeFirstLetter(str: string) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
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
      finalize(() => this.calculateWeaknesses())
    ).subscribe(res => this.damageRelations.push(res.damage_relations));
  }

  calculateWeaknesses() {
    // pokemon has two types
    if(this.damageRelations.length === 2) {
      const halfDamage1 = _.pluck(this.damageRelations[0].half_damage_from, 'name');
      const halfDamage2 = _.pluck(this.damageRelations[1].half_damage_from, 'name');
      const doubleDamage1 = _.pluck(this.damageRelations[0].double_damage_from, 'name');
      const doubleDamage2 = _.pluck(this.damageRelations[1].double_damage_from, 'name');
      this.noDamageFrom = _.pluck(_.union(this.damageRelations[0].no_damage_from, this.damageRelations[1].no_damage_from), 'name');

      const halfDamage = _.union(halfDamage1, halfDamage2);
      const doubleDamage = _.union(doubleDamage1, doubleDamage2);
      
      this.halfDamageFrom = _.without(halfDamage, ...doubleDamage);
      this.quarterDamageFrom = _.intersection(halfDamage1, halfDamage2);
      this.halfDamageFrom = _.difference(this.halfDamageFrom, this.quarterDamageFrom);
      this.quadDamageFrom = _.intersection(doubleDamage1, doubleDamage2);
      this.doubleDamageFrom = _.without(_.difference(doubleDamage, halfDamage), ...this.quadDamageFrom);
      this.normalDamageFrom = _.without(
        _.difference(PokemonTypes.Types, this.halfDamageFrom, this.doubleDamageFrom, this.quarterDamageFrom, this.quadDamageFrom),
        ...this.noDamageFrom
      );
    } else {
      this.halfDamageFrom = _.pluck(this.damageRelations[0].half_damage_from, 'name');
      this.doubleDamageFrom = _.pluck(this.damageRelations[0].double_damage_from, 'name');
      this.normalDamageFrom = _.difference(PokemonTypes.Types, this.halfDamageFrom, this.doubleDamageFrom);
    }
  }
}
