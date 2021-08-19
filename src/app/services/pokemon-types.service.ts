import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon/pokemon.model';
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
    const pokemonList: PokemonListItem[] = Storage.getPokemon();
    const pokemon = pokemonList?.find(item => item.id === id)

    if(pokemon && pokemon.types.length > 0) {
      return new Observable(o => o.complete());
    }

    return this.http.get<Pokemon>(url).pipe(
      map((res: Pokemon) => {
        const pokemonList: PokemonListItem[] = Storage.getPokemon();

        if(!pokemonList) {
          return res;
        }

        const pokemon = pokemonList.find(item => item.id === id)!;
        pokemon.types = res.types;
        
        Storage.updatePokemon(pokemon);
        
        return res;
      })
    );
  }
}
