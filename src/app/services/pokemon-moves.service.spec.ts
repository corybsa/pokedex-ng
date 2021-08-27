import { TestBed } from '@angular/core/testing';

import { PokemonMovesService } from './pokemon-moves.service';

describe('PokemonMovesService', () => {
  let service: PokemonMovesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonMovesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
