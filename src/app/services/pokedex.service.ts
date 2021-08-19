import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { concat, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { NamedApiResourceList } from '../models/common/named-api-resource-list.model';
import * as moment from 'moment';
import { PokemonTypesService } from './pokemon-types.service';
import { Storage } from '../models/util/storage';

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
    if(Storage.getPokemon() !== null) {
      const expireTime = Storage.getExpireTime();

      if(moment().isAfter(expireTime)) {
        return new Observable(o => o.complete()); 
      }
    }

    const url = 'https://pokeapi.co/api/v2/pokemon?limit=-1';

    return this.http.get<NamedApiResourceList>(url).pipe(
      map(item => {
        for(const res of item.results) {
          const id = +res.url.replace(/v2|\D/gi, '');

          if(id >= 10000) {
            break;
          }

          Storage.addPokemon({ id, name: res.name, types: [] });
        }

        Storage.setExpireTime(moment().add(1, 'week').toDate());
        Storage.savePokemon();

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
          subs.push(this.typesService.getPokemonTypes(id));
        });

        // execute subscriptions in order
        concat(...subs).pipe(
          finalize(() => Storage.savePokemon())
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
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    return this.http.get<Pokemon>(url);
  }
}
