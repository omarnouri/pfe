import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { RssService } from 'app/entities/rss/service/rss.service';
import { Rss } from 'app/entities/rss/rss.model';
import { HttpResponse } from '@angular/common/http';
import { IArticle } from './article.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { Client, IClient } from 'app/entities/client/client.model';

@Component({
  selector: 'sopra-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  fluxRss: Rss[] = [];
  articles: IArticle[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private rssService: RssService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        const clientId = account?.client?.id;
        if (clientId && account) {
          this.clientService.find(clientId).subscribe((res: HttpResponse<Client>) => {
            const clientWithRsses = res.body;
            account.client = clientWithRsses;
            this.account = account;
            this.fluxRss = this.account?.client?.rsses ?? [];
            this.transformXmlData();
          });
        }
      });
  }

  transformXmlData(): any {
    this.fluxRss.forEach((rss: Rss) => {
      if (rss.estActive) {
        this.parseRss(rss);
      }
    });
    this.articles.sort((el1, el2) => {
      el2.pubDate = el2.pubDate ?? '1990';
      el1.pubDate = el1.pubDate ?? '1990';
      return new Date(el1.pubDate).getTime() - new Date(el2.pubDate).getTime();
    });
    // return new window.DOMParser().parseFromString(str, "text/xml");
  }

  parseRss(rss: Rss): any {
    if (!rss.url) {
      return;
    }
    this.rssService.parseRss(rss.url).subscribe(res => {
      console.log(res);
      if (!res.code) {
        console.log(res);
        res.items.forEach((article: any) => {
          article.contentSnippet = article?.contentSnippet?.replace('--', '');
          article.content = article?.content?.replace('--', '');
          article.subtitle = rss.titre;
        });
        this.articles = this.articles.concat(res.items);
      }
    });
  }
  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
