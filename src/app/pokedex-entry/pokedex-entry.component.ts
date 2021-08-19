import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { TypeRelations } from '../models/pokemon/type-relations.model';
import { Type } from '../models/pokemon/type.model';
import { Helper } from '../models/util/helper';
import { PokedexService } from '../services/pokedex.service';
import { PokemonTypesService } from '../services/pokemon-types.service';

@Component({
  selector: 'app-pokedex-entry',
  templateUrl: './pokedex-entry.component.html',
  styleUrls: ['./pokedex-entry.component.css']
})
export class PokedexEntryComponent implements OnInit {
  pokemon!: Pokemon;
  damageRelations: TypeRelations[] = [];

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
    console.log('takes x damage');
  }

  calculateStrengths() {
    console.log('deals x damage');
  }
}
