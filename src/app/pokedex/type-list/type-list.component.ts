import { Component, Input, OnInit } from '@angular/core';
import { PokemonType } from 'src/app/models/pokemon/pokemon-type.model';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.css']
})
export class TypeListComponent implements OnInit {
  @Input() types: PokemonType[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  doSomethingWithTypes(id: number) {
    console.log(id);
  }
}
