import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbilityDetail } from '../../../../../../types/ability-detail';
import { Pokemon } from '../../../../../../types/pokemon';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-viewer',
  imports: [],
  template: `
    <div class="min-h-screen bg-gray-100 p-4">
        <app-team-belt></app-team-belt>

        <div class="max-w-md mx-auto mb-6">
            <app-pokemon-search></app-pokemon-search>
        </div>

        <div *ngIf="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading Pokemon...</p>
        </div>

        <div *ngIf="error" class="text-center py-12">
            <p class="text-red-500">Error loading Pokemon. Please try again.</p>
        </div>

        <div *ngIf="!loading && !error" class="relative max-w-4xl mx-auto">
            <button (click)="navigateToPokemon(-1)" class="nav-button absolute left-4 top-1/2 transform -translate-y-1/2"
                [disabled]="pokemon?.id === 1" [class.opacity-50]="pokemon?.id === 1">
                ←
            </button>

            <app-pokemon-card *ngIf="pokemon" [pokemon]="pokemon" [abilityDetails]="abilityDetails"></app-pokemon-card>

            <button (click)="navigateToPokemon(1)" class="nav-button absolute right-4 top-1/2 transform -translate-y-1/2"
                [disabled]="pokemon?.id === 898" [class.opacity-50]="pokemon?.id === 898">
                →
            </button>
        </div>
    </div>
  `,
  styles: ``
})
export class PokemonViewerComponent {
  pokemon: Pokemon | null = null;
  abilityDetails: AbilityDetail[] = [];
  loading = true;
  error = false;

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (!id) {
        this.router.navigate(['/pokemon', this.pokemonService.getRandomPokemonId()]);
        return;
      }
      this.loadPokemon(parseInt(id, 10));
    });
  }

  loadPokemon(id: number) {
    this.loading = true;
    this.error = false;
    this.pokemonService.getPokemonWithAbilities(id).subscribe({
      next: ([pokemon, abilities]) => {
        this.pokemon = pokemon;
        this.abilityDetails = abilities;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  navigateToPokemon(offset: number) {
    if (!this.pokemon) return;
    const newId = this.pokemon.id + offset;
    if (newId > 0 && newId <= 898) {
      this.router.navigate(['/pokemon', newId]);
    }
  }
}
