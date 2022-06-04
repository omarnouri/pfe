import { Component, Input } from '@angular/core';

@Component({
  selector: 'sopra-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  @Input() article: any = null;
}
