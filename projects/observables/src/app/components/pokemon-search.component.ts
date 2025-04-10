import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-pokemon-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AsyncPipe],
  template: `
    <div class="relative">
      <input type="text" [(ngModel)]="searchQuery" placeholder="Search Pokemon..."
          class="peer w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      <div class="peer-focus:block hidden absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
        @for (result of searchResults$ | async; track $index) {
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
  searchQuery = signal('');
  // To connect signals and observables we use the toObservable function from '@angular/core/rxjs-interop'.
  searchQuery$ = toObservable(this.searchQuery);
  // Now we can combine the user input with the pokemon list observable from the service.
  searchResults$ = combineLatest([this.searchQuery$, this.pokemonService.pokemonList$]).pipe(
    map(([search, list]) => {
      if (!list || !search) return [];

      const normalizedQuery = search.toLowerCase();
      return list
        .filter(pokemon => pokemon.name.includes(normalizedQuery))
        .slice(0, 10);
    })
  )

  selectPokemon(id: number) {
    // We reset the search after we select something.
    this.searchQuery.set('');
    this.router.navigate(['/pokemon', id]);
  }
}
