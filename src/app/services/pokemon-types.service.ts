import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { TypeRelations } from '../models/pokemon/type-relations.model';
import { Type } from '../models/pokemon/type.model';
import { Helper } from '../models/util/helper';
import { PokemonListItem } from '../models/util/pokemon-list-item.model';
import { Storage } from '../models/util/storage';

@Injectable({
  providedIn: 'root'
})
export class PokemonTypesService {

  constructor(
    private http: HttpClient
  ) { }

  getPokemonTypes(id: number): Observable<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokemonList: PokemonListItem[] = Storage.getPokemonList();
    const pokemon = pokemonList?.find(item => item.id === id)

    if(pokemon && pokemon.types.length > 0) {
      return new Observable(o => o.complete());
    }

    return this.http.get<Pokemon>(url).pipe(
      map((res: Pokemon) => {
        const pokemonList: PokemonListItem[] = Storage.getPokemonList();

        if (!pokemonList) {
          return res;
        }

        let pokemon = pokemonList.find(item => item.id === id)!;

        if(!pokemon) {
          pokemon = {
            id: res.id,
            name: res.name,
            types: [
              { 'slot': 1, 'type': { 'name': 'unknown', url: 'https://pokeapi.co/api/v2/type/10001/' } },
              { 'slot': 2, 'type': { 'name': 'unknown', url: 'https://pokeapi.co/api/v2/type/10001/' } }
            ]
          };
          
          return res;
        }

        pokemon.types = res.types;

        Storage.updatePokemonList(pokemon);

        return res;
      })
    );
  }

  getType(id: number): Observable<Type> {
    const type = Storage.getType(id);
    
    if(type !== undefined) {
      return new Observable(o => {
        o.next(type);
        o.complete();
      });
    }

    const url = `https://pokeapi.co/api/v2/type/${id}`;

    return this.http.get<Type>(url).pipe(
      tap(res => {
        Storage.addType(res);
      })
    );
  }
}
