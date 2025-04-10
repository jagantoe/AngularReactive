import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

// In this example application caching is less relevant
// because the pokemon api already provides a cache header so the calls are cached by the browser.
// This part is different vs the Observables project because I found no easy way
// to check the cache first without retriggering a resource signal.
export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);
  if (cacheService.has(req.url)) return of(cacheService.get(req.url));
  return next(req).pipe(
    tap(response => cacheService.set(req.url, response))
  );
};
