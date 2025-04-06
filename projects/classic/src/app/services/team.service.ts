import { Injectable } from '@angular/core';
import { Pokemon } from '../../../../../types/pokemon';

const TEAM_STORAGE_KEY = 'pokemon_team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly MAX_TEAM_SIZE = 6;

  team = this.loadTeamFromStorage();

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
    if (this.team.length >= this.MAX_TEAM_SIZE || this.team.some(p => p.id === pokemon.id)) {
      return false;
    }

    this.team.push(pokemon);
    this.saveTeamToStorage(this.team);
    return true;
  }

  removePokemon(pokemonId: number) {
    this.team = this.team.filter(p => p.id !== pokemonId);
    this.saveTeamToStorage(this.team);
  }
}
