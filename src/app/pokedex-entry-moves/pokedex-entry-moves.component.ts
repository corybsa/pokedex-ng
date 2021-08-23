import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { Helper } from '../models/util/helper';
import * as _ from 'underscore';

@Component({
  selector: 'app-pokedex-entry-moves',
  templateUrl: './pokedex-entry-moves.component.html',
  styleUrls: ['./pokedex-entry-moves.component.css']
})
export class PokedexEntryMovesComponent implements OnInit, OnChanges {
  @Input() pokemon!: Pokemon;
  moves: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if(this.pokemon) {
      this.getMoves();
    }
  }

  getMoves() {
    this.moves = {};

    for(let move of this.pokemon.moves) {
      for(let detail of move.version_group_details) {
        if(!this.moves[detail.version_group.name]) {
          this.moves[detail.version_group.name] = {};
        }

        if(!this.moves[detail.version_group.name][detail.move_learn_method.name]) {
          if(detail.move_learn_method.name === 'level-up') {
            this.moves[detail.version_group.name][detail.move_learn_method.name] = {};
          } else {
            this.moves[detail.version_group.name][detail.move_learn_method.name] = [];
          }
        }

        if(detail.move_learn_method.name === 'level-up') {
          this.moves[detail.version_group.name][detail.move_learn_method.name][detail.level_learned_at] = move.move.name;
        } else if(detail.move_learn_method.name === 'machine') {
          this.moves[detail.version_group.name][detail.move_learn_method.name][Helper.getIdFromUrl(move.move.url)] = move.move.name;
        } else {
          this.moves[detail.version_group.name][detail.move_learn_method.name].push(move.move.name);
        }
      }
    }
    
    console.log(this.moves);
  }

  why(e: any) {
    const test = [];

    for(let prop in e['level-up']) {
      if(prop !== undefined) {
        test.push({ level: prop, name: e['level-up'][prop] });
      }
    }

    return test;
  }
}
