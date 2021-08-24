import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChainLink } from 'src/app/models/evolution/chain-link.model';
import { EvolutionChain } from 'src/app/models/evolution/evolution-chain.model';
import { Pokemon } from 'src/app/models/pokemon/pokemon.model';
import { Helper } from 'src/app/models/util/helper';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-pokedex-entry-evolutions',
  templateUrl: './pokedex-entry-evolutions.component.html',
  styleUrls: ['./pokedex-entry-evolutions.component.css']
})
export class PokedexEntryEvolutionsComponent implements OnInit, OnChanges {
  @Input('pokemon') pokemon!: Pokemon;
  evolutionChain!: EvolutionChain;
  evolutions: any[] = [];

  constructor(
    private service: PokedexService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.evolutions = [];

    if(this.pokemon) {
      this.service.getSpeciesInfo(this.pokemon.species.url).subscribe(species => {
        this.service.getEvolutionChain(species.evolution_chain.url).subscribe(chain => {
          this.evolutionChain = chain;
          const id = Helper.getIdFromUrl(this.evolutionChain.chain.species.url);
          this.addEvolution(id, this.evolutionChain.chain.species.name, 0);
          this.getEvolutions(this.evolutionChain.chain);
        });
      });
    }
  }

  getEvolutions(chain: ChainLink) {
    for(let link of chain.evolves_to) {
      const id = Helper.getIdFromUrl(link.species.url);

      this.addEvolution(id, link.species.name, link.evolution_details[0].min_level);

      if(link.evolves_to.length > 0) {
        this.getEvolutions(link);
      }
    }
  }

  addEvolution(id: number, name: string, level: number) {
    this.evolutions.push({
      id: id,
      name: name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      level: level
    });
  }

  capitalizeFirstLetter(str: string) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  goToEntry(id: number) {
    this.router.navigate(['/pokedex', id]);
  }
}
