import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexEntryMovesComponent } from './pokedex-entry-moves.component';

describe('PokedexEntryMovesComponent', () => {
  let component: PokedexEntryMovesComponent;
  let fixture: ComponentFixture<PokedexEntryMovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokedexEntryMovesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokedexEntryMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
