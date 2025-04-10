import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { firstValueFrom, shareReplay, switchMap, tap } from 'rxjs';
import { MAXPOKEMONID } from '../../../../../../types/pokemon';
import { PokemonCardComponent } from '../../components/pokemon-card.component';
import { PokemonSearchComponent } from '../../components/pokemon-search.component';
import { PokemonTeamBeltComponent } from '../../components/pokemon-team-belt.component';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PokemonSearchComponent, PokemonTeamBeltComponent, PokemonCardComponent, AsyncPipe],
  template: `
    <div class="min-h-screen bg-gray-100 p-4">
      <app-pokemon-team-belt/>

      <!--
        In most cases the destination of the observable is to use their values in the template.
        To make this possible we can use the async pipe to subscribe to the observable and get the value.
        The async pipe will automatically unsubscribe from the observable when the component is destroyed,
        so we don't need to keep track of the subscription ourselves and worry about memory leaks.
        Even though pokemon$ is of type Observable<Pokemon> we see that the result of the async pipe is Pokemon | null.
        This is because in case of asynchronous code the value might not be available immediately.
        So we need to handle the case where the value is null. We can do this by using the @if directive.
        We can reference the result of the @if expression by using the 'as' keyword.
        Because the template will only render if the value is not null,
        we can safely use the pokemon variable within the template knowing it will always have a value.
      -->
      @if(pokemon$ | async; as pokemon) {
        <div class="flex gap-2 justify-center mb-6">
          <button (click)="navigateToPokemon(-1)" class="nav-button font-mono"
              [disabled]="pokemon.id === 1" [class.opacity-50]="pokemon.id === 1">
            ←
          </button>

          <app-pokemon-search/>

          <button (click)="navigateToPokemon(1)" class="nav-button font-mono"
              [disabled]="pokemon.id === maxPokemonId" [class.opacity-50]="pokemon.id === maxPokemonId">
            →
          </button>
        </div>

        <app-pokemon-card [pokemon]="pokemon"/>
      }
      <!-- Because the async pipe resolves to null while there is no value we can use the @else block for loading indicators -->
      @else {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading Pokemon...</p>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class PokemonViewerComponent {
  // As an alternative to constructor DI, we can use the inject function to get our dependencies inline.
  // The inject function can only be used at injection contexts: https://angular.dev/guide/di/dependency-injection-context
  // For that reason we usually want to make these dependencies readonly.
  // It also makes our reactive code cleaner because we can define everything inline and can leave out the constructor all together.
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  private readonly titleSerivce = inject(Title);

  readonly maxPokemonId = MAXPOKEMONID;

  // This component is used as a route component meaning that we can't pass the id as an input ourselves.
  // However by using withComponentInputBinding (see app.config.ts) we can tell Angular to assign the route parameters to this components inputs.
  // An other way to solve this is by injecting the 'ActivatedRoute' to get the route parameters.
  readonly id = input.required<number>();

  // We use the 'toObservable' function to convert the input signal into an observable.
  // This will form the base for the rest of the observable chain.
  readonly pokemon$ = toObservable(this.id).pipe(
    // We use the id we receive to turn it into an observable that describes the api call for fetching the pokemon.
    // However what we are really interested in is the result of that api call, for that we can use switchMap/concatMap/mergeMap/exhaustMap.
    // These will automatically subscribe to the received observable and emit any values that are emitted by it.
    switchMap(id => this.pokemonService.getPokemon(id)),
    // To have a side effect we can use the tap operator, this allows us to handle the value at this point without modifying the observable.
    tap(pokemon => this.titleSerivce.setTitle(pokemon.name)),
    // We use shareReplay to cache the result of the observable for any new subscribers.
    // Once the id changes and a new pokemon is fetched, the new value will replace the old one in the cache.
    // Important to note is that shareReplay will cache all values it receives but generally we are only interested in the last emitted value,
    // to solve that we can set the bufferSize to 1 to prevent uncessary caching.
    shareReplay(1)
  );

  // The only reference to the current pokemon is in the form of an observable.
  // So we need to use firstValueFrom to get the current pokemon, lastValueFrom would not work here because the observable never completes.
  // Even though it's treated as asynchronous, in practice it's synchronous because the value is cached by the 'shareReplay'.
  async navigateToPokemon(offset: number) {
    const value = await firstValueFrom(this.pokemon$);
    const newId = value.id + offset;
    if (newId > 0 && newId <= MAXPOKEMONID) {
      this.router.navigate(['/pokemon', newId]);
    }
  }
}
