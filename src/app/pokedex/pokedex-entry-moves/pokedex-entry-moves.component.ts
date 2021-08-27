import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PokemonMove } from 'src/app/models/pokemon/pokemon-move.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { PokemonMovesService } from 'src/app/services/pokemon-moves.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-pokedex-entry-moves',
  templateUrl: './pokedex-entry-moves.component.html',
  styleUrls: ['./pokedex-entry-moves.component.css']
})
export class PokedexEntryMovesComponent implements OnInit, OnChanges {
  @Input() pokemon!: Pokemon;
  moves: PokemonMove[] = [];

  constructor(
    private service: PokemonMovesService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if(this.pokemon) {
      this.service.getMovesLearnedByLevelUp(this.pokemon.id).subscribe(res => {
        this.moves = res;
      })
    }
  }
}
