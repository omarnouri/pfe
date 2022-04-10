import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChaine, getChaineIdentifier } from '../chaine.model';

export type EntityResponseType = HttpResponse<IChaine>;
export type EntityArrayResponseType = HttpResponse<IChaine[]>;

@Injectable({ providedIn: 'root' })
export class ChaineService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chaines');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chaine: IChaine): Observable<EntityResponseType> {
    return this.http.post<IChaine>(this.resourceUrl, chaine, { observe: 'response' });
  }

  update(chaine: IChaine): Observable<EntityResponseType> {
    return this.http.put<IChaine>(`${this.resourceUrl}/${getChaineIdentifier(chaine) as number}`, chaine, { observe: 'response' });
  }

  partialUpdate(chaine: IChaine): Observable<EntityResponseType> {
    return this.http.patch<IChaine>(`${this.resourceUrl}/${getChaineIdentifier(chaine) as number}`, chaine, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChaine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChaine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChaineToCollectionIfMissing(chaineCollection: IChaine[], ...chainesToCheck: (IChaine | null | undefined)[]): IChaine[] {
    const chaines: IChaine[] = chainesToCheck.filter(isPresent);
    if (chaines.length > 0) {
      const chaineCollectionIdentifiers = chaineCollection.map(chaineItem => getChaineIdentifier(chaineItem)!);
      const chainesToAdd = chaines.filter(chaineItem => {
        const chaineIdentifier = getChaineIdentifier(chaineItem);
        if (chaineIdentifier == null || chaineCollectionIdentifiers.includes(chaineIdentifier)) {
          return false;
        }
        chaineCollectionIdentifiers.push(chaineIdentifier);
        return true;
      });
      return [...chainesToAdd, ...chaineCollection];
    }
    return chaineCollection;
  }
}
