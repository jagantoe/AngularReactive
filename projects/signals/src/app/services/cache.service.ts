import { Injectable } from '@angular/core';

// Basic caching service that allows us to store values in memory.
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, any>();

  set(url: string, item: any) {
    this.cache.set(url, item);
  }

  get(url: string): any | undefined {
    return this.cache.get(url);
  }

  has(url: string): boolean {
    return this.cache.has(url);
  }
}
