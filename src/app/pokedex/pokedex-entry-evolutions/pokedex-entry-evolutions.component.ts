import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonEvolution } from 'src/app/models/pokemon/pokemon-evolution.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { EvolutionTrigger } from 'src/app/models/util/evolution-trigger.model';
import { EvolutionService } from 'src/app/services/evolution.service';

@Component({
  selector: 'app-pokedex-entry-evolutions',
  templateUrl: './pokedex-entry-evolutions.component.html',
  styleUrls: ['./pokedex-entry-evolutions.component.css']
})
export class PokedexEntryEvolutionsComponent implements OnInit, OnChanges {
  @Input('pokemon') pokemon!: Pokemon;
  evolutions: PokemonEvolution[] = [];
  evoTrigger = EvolutionTrigger;

  constructor(
    private service: EvolutionService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if(this.pokemon) {
      this.service.getEvolutions(this.pokemon.evolutionChainId).subscribe(res => {
        this.evolutions = res;
      });
    }
  }

  goToEntry(id: number) {
    this.router.navigate(['/pokedex', id]);
  }
}
