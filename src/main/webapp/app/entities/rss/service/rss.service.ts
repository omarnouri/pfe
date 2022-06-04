import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRss, getRssIdentifier } from '../rss.model';

export type EntityResponseType = HttpResponse<IRss>;
export type EntityArrayResponseType = HttpResponse<IRss[]>;

@Injectable({ providedIn: 'root' })
export class RssService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rsses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rss: IRss): Observable<EntityResponseType> {
    return this.http.post<IRss>(this.resourceUrl, rss, { observe: 'response' });
  }

  update(rss: IRss): Observable<EntityResponseType> {
    return this.http.put<IRss>(`${this.resourceUrl}/${getRssIdentifier(rss) as number}`, rss, { observe: 'response' });
  }

  partialUpdate(rss: IRss): Observable<EntityResponseType> {
    return this.http.patch<IRss>(`${this.resourceUrl}/${getRssIdentifier(rss) as number}`, rss, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRss>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRss[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  parseRss(url: string): Observable<any> {
    return this.http.get<IRss[]>(`http://localhost:3000/?url=${url}`);
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRssToCollectionIfMissing(rssCollection: IRss[], ...rssesToCheck: (IRss | null | undefined)[]): IRss[] {
    const rsses: IRss[] = rssesToCheck.filter(isPresent);
    if (rsses.length > 0) {
      const rssCollectionIdentifiers = rssCollection.map(rssItem => getRssIdentifier(rssItem)!);
      const rssesToAdd = rsses.filter(rssItem => {
        const rssIdentifier = getRssIdentifier(rssItem);
        if (rssIdentifier == null || rssCollectionIdentifiers.includes(rssIdentifier)) {
          return false;
        }
        rssCollectionIdentifiers.push(rssIdentifier);
        return true;
      });
      return [...rssesToAdd, ...rssCollection];
    }
    return rssCollection;
  }
}
