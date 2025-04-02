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

  readonly pokemonList$ = this.httpClient.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${MAXPOKEMONID}`).pipe(
    map(x => x.results.map(pokemon => ({ name: pokemon.name, id: parseInt(pokemon.url.split('/').slice(-2, -1)[0]) }))),
    shareReplay(1)
  );

  getPokemon(id: number): Observable<Pokemon> {
    return this.httpClient.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`);
  }

  getAbilityDetails(url: string): Observable<AbilityDetail> {
    if (this.abilityCache.has(url)) {
      return of(this.abilityCache.get(url)!);
    }

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

        this.abilityCache.set(url, processedAbility);
        return processedAbility;
      })
    );
  }

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * 898) + 1;
  }
}
