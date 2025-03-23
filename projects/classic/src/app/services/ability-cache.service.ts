import { Injectable } from '@angular/core';
import { AbilityDetail } from '../../../../../types/ability-detail';

@Injectable({
  providedIn: 'root'
})
export class AbilityCacheService {
  private cache = new Map<string, AbilityDetail>();

  set(url: string, ability: AbilityDetail) {
    this.cache.set(url, ability);
  }

  get(url: string): AbilityDetail | undefined {
    return this.cache.get(url);
  }

  has(url: string): boolean {
    return this.cache.has(url);
  }
}
