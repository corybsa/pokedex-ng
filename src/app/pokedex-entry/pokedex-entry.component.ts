import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { PokedexService } from '../services/pokedex.service';

@Component({
  selector: 'app-pokedex-entry',
  templateUrl: './pokedex-entry.component.html',
  styleUrls: ['./pokedex-entry.component.css']
})
export class PokedexEntryComponent implements OnInit {
  pokemon!: Pokemon;

  constructor(
    private service: PokedexService,
    private route: ActivatedRoute
  ) {
    const id = +this.route.snapshot.params['id'];
    this.service.getPokemon(id).subscribe(p => this.pokemon = p);
  }

  ngOnInit(): void {
  }

  test() {
    console.log(this.pokemon);
  }
}
