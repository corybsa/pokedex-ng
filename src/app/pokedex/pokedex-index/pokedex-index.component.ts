import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Helper } from '../../models/util/helper';
import { PokemonListItem } from '../../models/pokemon/pokemon-list-item.model';
import { PokedexService } from '../../services/pokedex.service';
import { EntryPageCache } from 'src/app/models/cache/entry-page-cache';

@Component({
  selector: 'app-pokedex-index',
  templateUrl: './pokedex-index.component.html',
  styleUrls: ['./pokedex-index.component.css']
})
export class PokedexIndexComponent implements OnInit, OnDestroy {
  pokemon!: PokemonListItem[];
  page!: PokemonListItem[];
  isSearching = false;
  searchTimeout: number = Infinity;
  helper = Helper;

  pageNum: number = 0;
  pageSize: number = 20;

  get offset(): number {
    return this.pageNum * this.pageSize;
  };

  constructor(
    private service: PokedexService,
    private router: Router,
    private entryPageCache: EntryPageCache
  ) {
    this.pageNum = this.entryPageCache.getEntryPage();

    this.service.getPokemonList().subscribe(res => {
      this.pokemon = res;
      this.page = this.pokemon.slice(this.offset, this.offset + this.pageSize);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.entryPageCache.setEntryPage(this.pageNum);
  }

  getPageSize() {
    return this.pageSize;
  }

  getCurrentPage() {
    return this.pageNum;
  }

  getPreviousPage() {
    this.pageNum--;
    this.page = this.pokemon.slice(this.offset, this.offset + this.pageSize);
  }

  getNextPage() {
    this.pageNum++;
    this.page = this.pokemon.slice(this.offset, this.offset + this.pageSize);
  }

  goToPage(num: number) {
    this.pageNum = num;
    this.page = this.pokemon.slice(this.offset, this.offset + this.pageSize);
  }

  changePage(event: PageEvent) {
    if(!this.isSearching) {
      this.pageSize = event.pageSize;
      this.goToPage(event.pageIndex);
    }
  }

  getIdFromUrl(url: string): number {
    return Helper.getIdFromUrl(url);
  }

  goToPokemon(id: number) {
    this.router.navigate(['pokedex', id]);
  }

  getPokemonImageUrl(id: number) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  searchList(searchTerm: string) {
    if(searchTerm === '') {
      this.isSearching = false;
      this.goToPage(this.getCurrentPage());
      return;
    }

    window.clearTimeout(this.searchTimeout);

    this.searchTimeout = window.setTimeout(() => {
      const regex = new RegExp(searchTerm, 'gi');
      this.page = this.pokemon.filter(item => item.name.match(regex));
      
      this.isSearching = true;
    }, 250);
  }

  clearSearch(input: HTMLInputElement) {
    input.value = '';
    this.isSearching = false;
    this.goToPage(this.getCurrentPage());
  }
}
