import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { concat, Observable } from 'rxjs';
import { NamedApiResourceList } from '../models/common/named-api-resource-list.model';
import { NamedApiResource } from '../models/common/named-api-resource.model';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { Helper } from '../models/util/helper';
import { PokemonListItem } from '../models/util/pokemon-list-item.model';
import { PokedexService } from '../services/pokedex.service';

@Component({
  selector: 'app-pokedex-index',
  templateUrl: './pokedex-index.component.html',
  styleUrls: ['./pokedex-index.component.css']
})
export class PokedexIndexComponent implements OnInit {
  pokemon!: NamedApiResourceList;
  isSearching = false;
  searchTimeout: number = Infinity;

  constructor(
    private service: PokedexService,
    private router: Router
  ) {
    this.service.getPokemonList().subscribe(res => this.pokemon = res);
  }

  ngOnInit(): void {
  }

  getPageSize() {
    return this.service.pageSize;
  }

  getCurrentPage() {
    return this.service.page;
  }

  getPreviousPage() {
    this.service.getPreviousPage().subscribe(res => this.pokemon = res);
  }

  getNextPage() {
    this.service.getNextPage().subscribe(res => this.pokemon = res);
  }

  goToPage(num: number) {
    this.service.getPage(num).subscribe(res => this.pokemon = res);
  }

  getIdFromUrl(url: string): number {
    return +url.replace(/v2|\D/gi, '');
  }

  getPokemonTypes(url: string) {
    const id = this.getIdFromUrl(url);
    const pokemonList: PokemonListItem[] = JSON.parse(localStorage.getItem(Helper.StorageKeys.pokemonList) as string);

    if(!pokemonList) {
      return [];
    }

    const pokemon: PokemonListItem = pokemonList.find(item => item.id === id)!;

    return pokemon.types;
  }

  capitalizeFirstLetter(str: string) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  goToPokemon(url: string) {
    const id = this.getIdFromUrl(url);
    this.router.navigate(['pokedex', id]);
  }

  getPokemonImageUrl(url: string) {
    const id = this.getIdFromUrl(url);
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  changePage(event: PageEvent) {
    if(!this.isSearching) {
      this.service.pageSize = event.pageSize;
      this.goToPage(event.pageIndex);
    }
  }

  searchList(value: string) {
    if(value === '') {
      this.isSearching = false;
      this.goToPage(this.getCurrentPage());
      return;
    }

    window.clearTimeout(this.searchTimeout);

    this.searchTimeout = window.setTimeout(() => {
      let pokemonList: PokemonListItem[] = JSON.parse(localStorage.getItem(Helper.StorageKeys.pokemonList) as string);
      const regex = new RegExp(value, 'gi');
      pokemonList = pokemonList.filter(item => item.name.match(regex));
      const subs: Observable<Pokemon>[] = [];

      const results: NamedApiResource[] = pokemonList.map(item => {
        subs.push(this.service.getPokemonTypes(item.id));

        return {
          name: item.name,
          url: `https://pokeapi.co/api/v2/pokemon/${item.id}`
        };
      });

      concat(...subs).subscribe();

      this.isSearching = true;

      this.pokemon = {
        count: pokemonList.length,
        next: '',
        previous: '',
        results
      };
    }, 250);
  }

  clearSearch(input: HTMLInputElement) {
    input.value = '';
    this.isSearching = false;
    this.goToPage(this.getCurrentPage());
  }
}
