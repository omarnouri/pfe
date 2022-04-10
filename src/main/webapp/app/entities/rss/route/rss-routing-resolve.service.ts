import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRss, Rss } from '../rss.model';
import { RssService } from '../service/rss.service';

@Injectable({ providedIn: 'root' })
export class RssRoutingResolveService implements Resolve<IRss> {
  constructor(protected service: RssService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRss> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rss: HttpResponse<Rss>) => {
          if (rss.body) {
            return of(rss.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Rss());
  }
}
