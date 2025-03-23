import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { AbilityDetail } from '../../../../../types/ability-detail';
import { Pokemon } from '../../../../../types/pokemon';
import { PokemonListResponse } from '../../../../../types/pokemon-list-response';
import { AbilityCacheService } from './ability-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private pokemonList: Array<{ name: string, url: string }> | null = null;

  constructor(
    private http: HttpClient,
    private abilityCache: AbilityCacheService
  ) {
    this.loadPokemonList();
  }

  private loadPokemonList() {
    this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=898`)
      .subscribe(response => {
        this.pokemonList = response.results;
      });
  }

  searchPokemon(query: string): Array<{ name: string, id: number }> {
    if (!this.pokemonList || !query) return [];

    const normalizedQuery = query.toLowerCase();
    return this.pokemonList
      .filter(pokemon => pokemon.name.includes(normalizedQuery))
      .map(pokemon => ({
        name: pokemon.name,
        id: parseInt(pokemon.url.split('/').slice(-2, -1)[0])
      }))
      .slice(0, 10);
  }

  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`);
  }

  getAbilityDetails(url: string): Observable<AbilityDetail> {
    if (this.abilityCache.has(url)) {
      return of(this.abilityCache.get(url)!);
    }

    return this.http.get<AbilityDetail>(url).pipe(
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

  getPokemonWithAbilities(id: number): Observable<[Pokemon, AbilityDetail[]]> {
    return this.getPokemon(id).pipe(
      switchMap(pokemon => {
        const abilityRequests = pokemon.abilities.map(a =>
          this.getAbilityDetails(a.ability.url)
        );
        return forkJoin([
          Promise.resolve(pokemon),
          forkJoin(abilityRequests)
        ]);
      })
    );
  }

  getRandomPokemonId(): number {
    return Math.floor(Math.random() * 898) + 1;
  }
}
