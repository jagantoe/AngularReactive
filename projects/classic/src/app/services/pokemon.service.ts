import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AbilityDetail } from '../../../../../types/ability-detail';
import { MAXPOKEMONID, Pokemon } from '../../../../../types/pokemon';
import { PokemonListResponse } from '../../../../../types/pokemon-list-response';
import { AbilityCacheService } from './ability-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  pokemonList: { name: string; id: number; }[] | undefined;

  constructor(private httpClient: HttpClient, private abilityCache: AbilityCacheService) {
    // We need the pokemon list to be available as soon as possible so we subscribe to the observable in the constructor.
    // When the result comes in we set the pokemonList property to the result.
    // The httpClient observable will complete when the request is done so we don't need to unsubscribe from it.
    this.httpClient.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${MAXPOKEMONID}`).subscribe(x =>
      this.pokemonList = x.results.map(pokemon => ({ name: pokemon.name, id: parseInt(pokemon.url.split('/').slice(-2, -1)[0]) }))
    );
  }

  async getPokemon(id: number): Promise<Pokemon> {
    // To make the api call we need to subscribe to the observable from the httpClient
    // To make this easier we can use the firstValueFrom function from rxjs to convert the observable to a promise and await the result.
    // Note: in older code you might find toPromise() being used, this has been deprecated and will be removed in the future.
    // https://rxjs.dev/deprecations/to-promise
    return await firstValueFrom(this.httpClient.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`));
  }

  async getAbilityDetails(url: string): Promise<AbilityDetail> {
    // We check the cache and return the ability if it is already cached.
    if (this.abilityCache.has(url)) {
      return this.abilityCache.get(url)!;
    }

    // If the ability is not cached we make the api call and process the response.
    const ability = await firstValueFrom(this.httpClient.get<AbilityDetail>(url));
    const englishEffect = ability.effect_entries.find(entry => entry.language.name === 'en');

    const processedAbility: AbilityDetail = {
      name: ability.name,
      effect_entries: englishEffect
        ? [englishEffect]
        : [{ effect: 'No English description available.', language: { name: 'en' } }]
    };

    // We add the processed ability to the cache for when it's retrieved in the future.
    this.abilityCache.set(url, processedAbility);
    return processedAbility;
  }

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * 898) + 1;
  }
}
