import { TestBed } from '@angular/core/testing';

import { PokemonTypesService } from './pokemon-types.service';

describe('PokemonTypesService', () => {
  let service: PokemonTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
