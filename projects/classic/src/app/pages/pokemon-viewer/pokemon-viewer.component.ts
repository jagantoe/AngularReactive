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

      <!--
        We use *ngIf to show or hide specific parts of the template.
        Because it's a directive it needs to be added onto some html element.
        In this case we use a ng-container which is a logical container that doesn't render anything in the DOM.
        That is prefered over something like a div or span so it doesn't mess with possible styling.
      -->
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
      <!-- Similarly ng-template is not part of the DOM and only rendered when an Angular directive says it should be. -->
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

  // The constructor is used to inject the services we need in this component.
  constructor(private pokemonService: PokemonService,
    private route: ActivatedRoute, private router: Router,
    private titleSerivce: Title) { }

  ngOnInit() {
    // When the route params change we want to react and fetch the new pokemon and set the title.
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
    // Because there is no clear divide between the pokemon being loaded or not,
    // you often see the ! operator used to assert that the pokemon is not undefined.
    const newId = this.pokemon!.id + offset;
    if (newId > 0 && newId <= MAXPOKEMONID) {
      this.router.navigate(['/pokemon', newId]);
    }
  }
}
