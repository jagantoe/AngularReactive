import { Component, Input } from '@angular/core';
import { Pokemon } from '../../../../../types/pokemon';

@Component({
  selector: 'app-pokemon-stats',
  imports: [],
  template: `
    <div class="mt-6">
        <h3 class="font-bold text-lg mb-2">Stats</h3>
        <div class="space-y-2">
            <div *ngFor="let stat of pokemon.stats" class="flex items-center">
                <span class="w-24 text-gray-600 capitalize">{{stat.stat.name}}</span>
                <div class="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500" [style.width.%]="(stat.base_stat / 255) * 100"></div>
                </div>
                <span class="ml-2 w-12 text-right">{{stat.base_stat}}</span>
            </div>
        </div>
    </div>
  `,
  styles: ``
})
export class PokemonStatsComponent {
  @Input() pokemon!: Pokemon;
}
