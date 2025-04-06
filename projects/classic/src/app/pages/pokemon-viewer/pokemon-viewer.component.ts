import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MAXPOKEMONID, Pokemon } from '../../../../../../types/pokemon';
import { CHANGE_DETECTION } from '../../app.module';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-viewer',
  standalone: false,
  changeDetection: CHANGE_DETECTION,
  template: `
    <div class="min-h-screen bg-gray-100 p-4">
      <app-pokemon-team-belt></app-pokemon-team-belt>

      <ng-container *ngIf="pokemon; else loading">
        <div class="flex gap-2 justify-center mb-6">
          <button (click)="navigateToPokemon(-1)" class="nav-button font-mono"
              [disabled]="pokemon.id === 1" [class.opacity-50]="pokemon.id === 1">
            ←
          </button>

          <app-pokemon-search></app-pokemon-search>

          <button (click)="navigateToPokemon(1)" class="nav-button font-mono"
              [disabled]="pokemon.id === maxPokemonId" [class.opacity-50]="pokemon.id === maxPokemonId">
            →
          </button>
        </div>

        <app-pokemon-card [pokemon]="pokemon"/>
      </ng-container>
      <ng-template #loading>
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading Pokemon...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: ``
})
export class PokemonViewerComponent implements OnInit {
  readonly maxPokemonId = MAXPOKEMONID;
  pokemon: Pokemon | undefined;

  constructor(private pokemonService: PokemonService,
    private route: ActivatedRoute, private router: Router,
    private titleSerivce: Title) { }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      const id = +params['id'];
      if (id) {
        const pokemon = await this.pokemonService.getPokemon(id);
        this.titleSerivce.setTitle(pokemon.name);
        this.pokemon = pokemon;
      }
    });
  }

  async navigateToPokemon(offset: number) {
    const newId = this.pokemon!.id + offset;
    if (newId > 0 && newId <= MAXPOKEMONID) {
      this.router.navigate(['/pokemon', newId]);
    }
  }
}
