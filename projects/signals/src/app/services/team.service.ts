import { effect, Injectable, signal } from '@angular/core';
import { Pokemon } from '../../../../../types/pokemon';

const TEAM_STORAGE_KEY = 'pokemon_team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly MAX_TEAM_SIZE = 6;
  private teamStore = signal<Pokemon[]>(this.loadTeamFromStorage());
  team = this.teamStore.asReadonly();

  constructor() {
    effect(() => this.saveTeamToStorage(this.team()));
  }

  private loadTeamFromStorage(): Pokemon[] {
    try {
      const savedTeam = localStorage.getItem(TEAM_STORAGE_KEY);
      return savedTeam ? JSON.parse(savedTeam) : [];
    } catch (error) {
      console.error('Error loading team from storage:', error);
      return [];
    }
  }

  private saveTeamToStorage(team: Pokemon[]) {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
    } catch (error) {
      console.error('Error saving team to storage:', error);
    }
  }

  addPokemon(pokemon: Pokemon): boolean {
    const currentTeam = this.team();
    if (currentTeam.length >= this.MAX_TEAM_SIZE || currentTeam.some(p => p.id === pokemon.id)) {
      return false;
    }
    this.teamStore.update(t => t.concat(pokemon));
    return true;
  }

  removePokemon(pokemonId: number) {
    this.teamStore.update(t => t.filter(p => p.id !== pokemonId));
  }
}
