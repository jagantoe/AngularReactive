import { ChangeDetectionStrategy, Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-pokemon-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="relative">
      <input type="text" [(ngModel)]="searchQuery" placeholder="Search Pokemon..."
          class="peer w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      <div class="peer-focus:block hidden absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
        @for (result of searchResults(); track $index) {
          <button (mousedown)="selectPokemon(result.id)"
              class="w-full px-4 py-2 text-left hover:bg-gray-100 capitalize">
            {{result.name}}
          </button>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class PokemonSearchComponent {
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);

  // We use a signal so we can two-way bind the input value to the signal.
  // This way we now can reactively react to input from the user.
  searchQuery = model('');
  // The computed signal will be retrigged each time the searchQuery signal changes.
  // Any computation it does has to resolve synchronously so we are limited in what we can do.
  // Note: one thing to be careful of is that inside the searchPokemon method we check the value of the pokemonList signal.
  // This will also mark the pokemonList as a dependency for this computed meaning that if it was ever updated then this searchResults also retriggers.
  searchResults = computed(() => this.pokemonService.searchPokemon(this.searchQuery()));

  selectPokemon(id: number) {
    // We reset the search after we select something.
    this.searchQuery.set('');
    this.router.navigate(['/pokemon', id]);
  }
}
