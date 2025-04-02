import { Component, Input } from '@angular/core';
import { Pokemon } from '../../../../../types/pokemon';

@Component({
  selector: 'app-pokemon-moves',
  imports: [],
  template: `
    <div class="mt-6">
        <button (click)="isExpanded = !isExpanded"
            class="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <h3 class="font-bold text-lg">Moves ({{pokemon.moves.length}})</h3>
            <span class="transform transition-transform" [class.rotate-180]="isExpanded">↓</span>
        </button>

        <div *ngIf="isExpanded" class="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
            <div *ngFor="let move of pokemon.moves" class="p-2 bg-gray-50 rounded capitalize text-sm">
                {{move.move.name}}
            </div>
        </div>
    </div>
  `,
  styles: ``
})
export class PokemonMovesComponent {
  @Input() pokemon!: Pokemon;
  isExpanded = false;
}
