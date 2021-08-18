import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { concat, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { NamedApiResourceList } from '../models/common/named-api-resource-list.model';
import { Helper } from '../models/util/helper';
import * as moment from 'moment';
import { PokemonListItem } from '../models/util/pokemon-list-item.model';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  public page: number = 0;
  public pageSize: number = 20;

  private get offset(): number {
    return this.page * this.pageSize;
  };

  constructor(
    private http: HttpClient
  ) {
    this.getAllPokemon().subscribe();
  }

  private getAllPokemon(): Observable<NamedApiResourceList> {
    if(localStorage.getItem(Helper.StorageKeys.pokemonList) !== null) {
      const expireTime = moment(localStorage.getItem(Helper.StorageKeys.expireTime));

      if(moment().isAfter(expireTime)) {
        return new Observable(o => o.complete()); 
      }
    }

    const url = 'https://pokeapi.co/api/v2/pokemon?limit=-1';

    return this.http.get<NamedApiResourceList>(url).pipe(
      map(item => {
        const payload: PokemonListItem[] = [];

        for(const res of item.results) {
          const id = +res.url.replace(/v2|\D/gi, '');

          if(id >= 10000) {
            break;
          }

          payload.push({ id, name: res.name, types: [] });
        }

        localStorage.setItem(Helper.StorageKeys.expireTime, moment().toDate().toISOString());
        localStorage.setItem(Helper.StorageKeys.pokemonList, JSON.stringify(payload));

        return item;
      })
    );
  }

  getPokemonList(): Observable<NamedApiResourceList> {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${this.offset}&limit=${this.pageSize}`;

    return this.http.get<NamedApiResourceList>(url).pipe(
      map(res => {
        const subs: Observable<Pokemon>[] = [];

        res.results.forEach(item => {
          const id: number = +item.url.replace(/v2|\D/gi, '');
          subs.push(this.getPokemonTypes(id));
        });

        // execute subscriptions in order
        concat(...subs).subscribe();

        return res;
      })
    );
  }

  getPokemonTypes(id: number): Observable<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokemonList: PokemonListItem[] = JSON.parse(localStorage.getItem(Helper.StorageKeys.pokemonList) as string);
    const pokemon = pokemonList?.find(item => item.id === id)

    if(pokemon && pokemon.types.length > 0) {
      return new Observable(o => o.complete());
    }

    return this.http.get<Pokemon>(url).pipe(
      map((res: Pokemon) => {
        const pokemonList: PokemonListItem[] = JSON.parse(localStorage.getItem(Helper.StorageKeys.pokemonList) as string);
        const pokemon = pokemonList.find(item => item.id === id)
        pokemon!.types = res.types;
        
        const index = pokemonList.findIndex(item => item.id === id);
        pokemonList[index] = pokemon!;
        localStorage.setItem(Helper.StorageKeys.pokemonList, JSON.stringify(pokemonList));

        return res;
      })
    );
  }

  getNextPage(): Observable<NamedApiResourceList> {
    this.page++;
    return this.getPokemonList();
  }

  getPreviousPage(): Observable<NamedApiResourceList> {
    if(this.page > 1) {
      this.page--;
    }

    return this.getPokemonList();
  }

  getPage(pageNum: number): Observable<NamedApiResourceList> {
    this.page = pageNum;
    return this.getPokemonList();
  }

  getPokemonSprite(id: number): Observable<any> {
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return this.http.get<any>(url);
  }

  getPokemon(id: number): Observable<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    return this.http.get<Pokemon>(url);
  }
}
