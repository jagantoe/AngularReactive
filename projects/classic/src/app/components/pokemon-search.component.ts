import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CHANGE_DETECTION } from '../app.module';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-pokemon-search',
  standalone: false,
  changeDetection: CHANGE_DETECTION,
  template: `
    <div class="relative">
      <!-- We trigger the search function on each keystroke using the input event binding -->
      <input type="text" [(ngModel)]="searchQuery" (input)="search()" placeholder="Search Pokemon..."
          class="peer w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      <div class="peer-focus:block hidden absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
        <button *ngFor="let result of results" (mousedown)="selectPokemon(result.id)"
            class="w-full px-4 py-2 text-left hover:bg-gray-100 capitalize">
          {{result.name}}
        </button>
      </div>
    </div>
  `,
  styles: ``
})
export class PokemonSearchComponent {
  searchQuery = "";
  results: { name: string; id: number; }[] = [];

  constructor(private pokemonService: PokemonService, private router: Router) { }

  search(): void {
    if (!this.pokemonService.pokemonList || !this.searchQuery) {
      this.results = [];
      return;
    }

    const normalizedQuery = this.searchQuery.toLowerCase();
    this.results = this.pokemonService.pokemonList
      .filter(pokemon => pokemon.name.includes(normalizedQuery))
      .slice(0, 10);
  }

  selectPokemon(id: number) {
    // We reset the searchQuery and manually trigger the search to clear the results.
    this.searchQuery = "";
    this.search();
    this.router.navigate(['/pokemon', id]);
  }
}
