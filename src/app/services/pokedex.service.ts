import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { concat, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { NamedApiResourceList } from '../models/common/named-api-resource-list.model';
import * as moment from 'moment';
import { PokemonTypesService } from './pokemon-types.service';
import { Storage } from '../models/util/storage';
import { Helper } from '../models/util/helper';

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
    private http: HttpClient,
    private typesService: PokemonTypesService
  ) {
    this.getAllPokemon().subscribe();
  }

  private getAllPokemon(): Observable<NamedApiResourceList> {
    if(Storage.getPokemonList() !== null) {
      const expireTime = Storage.getExpireTime();

      if(moment().isBefore(expireTime)) {
        return new Observable(o => o.complete());
      }
    }

    const url = 'https://pokeapi.co/api/v2/pokemon?limit=-1';

    return this.http.get<NamedApiResourceList>(url).pipe(
      map(item => {
        for(const res of item.results) {
          const id = Helper.getIdFromUrl(res.url);

          if(id >= 10000) {
            break;
          }

          Storage.addPokemonToList({ id, name: res.name, types: [] });
        }

        Storage.setExpireTime(moment().add(1, 'week').toDate());
        Storage.savePokemonList();

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
          const id: number = Helper.getIdFromUrl(item.url);
          subs.push(this.typesService.getPokemonTypes(id));
        });

        // execute subscriptions in order
        concat(...subs).pipe(
          finalize(() => Storage.savePokemonList())
        ).subscribe();

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

  getPokemon(id: number): Observable<Pokemon> {
    const pokemon = Storage.getPokemon(id);

    if(pokemon) {
      return new Observable(o => {
        o.next(pokemon);
        o.complete();
      });
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    return this.http.get<Pokemon>(url).pipe(
      tap(res => Storage.addPokemon(res))
    );
  }
}
