import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { PokedexService } from '../services/pokedex.service';
import * as _ from 'underscore';

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
    const id = +this.route.snapshot.params['id'];
    this.service.getPokemon(id).subscribe(p => {
      this.pokemon = p;
    });
  }

  ngOnInit(): void {
  }

  capitalizeFirstLetter(str: string) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
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
}
