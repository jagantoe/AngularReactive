import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-pokemon-search',
  imports: [],
  template: `
    <div class="relative">
        <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" (blur)="onBlur()" placeholder="Search Pokemon..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">

        <div *ngIf="showResults && searchResults.length > 0"
            class="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto animate-expand">
            <button *ngFor="let result of searchResults" (click)="selectPokemon(result.id)"
                class="w-full px-4 py-2 text-left hover:bg-gray-100 capitalize">
                {{result.name}}
            </button>
        </div>
    </div>
  `,
  styles: ``
})
export class PokemonSearchComponent {
  searchQuery = '';
  searchResults: Array<{ name: string, id: number }> = [];
  showResults = false;

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) { }

  onSearch() {
    this.searchResults = this.pokemonService.searchPokemon(this.searchQuery);
    this.showResults = true;
  }

  selectPokemon(id: number) {
    this.searchQuery = '';
    this.showResults = false;
    this.router.navigate(['/pokemon', id]);
  }

  onBlur() {
    // Delay hiding results to allow click events to fire
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }
}
