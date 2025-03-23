import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../../../../../types/pokemon';

const TEAM_STORAGE_KEY = 'pokemon_team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly MAX_TEAM_SIZE = 6;
  private teamSubject = new BehaviorSubject<Pokemon[]>(this.loadTeamFromStorage());
  team$ = this.teamSubject.asObservable();

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
    const currentTeam = this.teamSubject.value;
    if (currentTeam.length >= this.MAX_TEAM_SIZE) {
      return false;
    }
    if (currentTeam.some(p => p.id === pokemon.id)) {
      return false;
    }
    const newTeam = [...currentTeam, pokemon];
    this.teamSubject.next(newTeam);
    this.saveTeamToStorage(newTeam);
    return true;
  }

  removePokemon(pokemonId: number) {
    const currentTeam = this.teamSubject.value;
    const newTeam = currentTeam.filter(p => p.id !== pokemonId);
    this.teamSubject.next(newTeam);
    this.saveTeamToStorage(newTeam);
  }
}
