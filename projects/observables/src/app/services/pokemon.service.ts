import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, shareReplay } from 'rxjs';
import { AbilityDetail } from '../../../../../types/ability-detail';
import { MAXPOKEMONID, Pokemon } from '../../../../../types/pokemon';
import { PokemonListResponse } from '../../../../../types/pokemon-list-response';
import { AbilityCacheService } from './ability-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  private readonly httpClient = inject(HttpClient);
  private readonly abilityCache = inject(AbilityCacheService);

  // This is an easy way to fetch data and cache it for the lifetime of the app.
  // The 'shareReplay' will cache the result and replay it to any new subscribers.
  // Since the source obserable is the api call itself we have no way to retrigger it.
  readonly pokemonList$ = this.httpClient.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${MAXPOKEMONID}`).pipe(
    map(x => x.results.map(pokemon => ({ name: pokemon.name, id: parseInt(pokemon.url.split('/').slice(-2, -1)[0]) }))),
    shareReplay(1)
  );

  // For fetching data we generally want to return observables so that we can leave it to the caller to decide when to subscribe.
  // In most cases these kind of functions would be generated based on a swagger file using something like ng-openapi-gen https://github.com/cyclosproject/ng-openapi-gen
  getPokemon(id: number): Observable<Pokemon> {
    return this.httpClient.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`);
  }

  getAbilityDetails(url: string): Observable<AbilityDetail> {
    // Here we want to check the local cache first before making the api call.
    // Because the function returns an observable we can use the 'of' operator to create an observable from the cached value.
    if (this.abilityCache.has(url)) {
      return of(this.abilityCache.get(url)!);
    }

    // If the value is not in the cache we return an observable of the api call.
    // We use the 'map' operator to modify the result to our desired format.
    return this.httpClient.get<AbilityDetail>(url).pipe(
      map(ability => {
        const englishEffect = ability.effect_entries.find(
          entry => entry.language.name === 'en'
        );

        const processedAbility: AbilityDetail = {
          name: ability.name,
          effect_entries: englishEffect
            ? [englishEffect]
            : [{ effect: 'No English description available.', language: { name: 'en' } }]
        };

        // Even if the observable is returned and subscribed somewhere else we can still access the cache here.
        // This is made possible by closures in javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
        this.abilityCache.set(url, processedAbility);
        return processedAbility;
      })
    );
  }

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * 898) + 1;
  }
}
