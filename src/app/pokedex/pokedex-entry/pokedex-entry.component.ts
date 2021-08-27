import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokedexService } from '../../services/pokedex.service';
import * as _ from 'underscore';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';

@Component({
  selector: 'app-pokedex-entry',
  templateUrl: './pokedex-entry.component.html',
  styleUrls: ['./pokedex-entry.component.css']
})
export class PokedexEntryComponent implements OnInit {
  pokemon!: Pokemon;

  constructor(
    private service: PokedexService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(values => {
      this.getPokemonData(+values.id);
    });
  }

  ngOnInit(): void {
  }

  getPokemonData(id: number) {
    this.service.getPokemon(id).subscribe(p => this.pokemon = p);
  }

  back() {
    this.router.navigate(['/']);
  }

  convertToFeet(height: number) {
    const feet = Math.floor(height * 0.3281);
    const inches = Math.round((12 * ((height * 0.3281) - feet)));
    return `${feet}' ${inches}"`;
  }

  convertToPounds(weight: number) {
    return (weight * 0.2205).toFixed(1);
  }

  doSomethingWithTypes(id: number) {
    console.log(id);
  }
}
