import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);
  if (cacheService.has(req.url)) return of(cacheService.get(req.url));
  return next(req).pipe(
    tap(response => cacheService.set(req.url, response))
  );
};
