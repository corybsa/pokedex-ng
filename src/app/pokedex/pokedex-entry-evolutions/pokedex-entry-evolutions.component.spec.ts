import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexEntryEvolutionsComponent } from './pokedex-entry-evolutions.component';

describe('PokedexEntryEvolutionsComponent', () => {
  let component: PokedexEntryEvolutionsComponent;
  let fixture: ComponentFixture<PokedexEntryEvolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokedexEntryEvolutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokedexEntryEvolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
