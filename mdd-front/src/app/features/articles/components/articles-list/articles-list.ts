import { Component, input } from '@angular/core';
import { Article } from '../../models/article.interface';
import { ArticleCard } from '../article-card/article-card';

@Component({
  imports: [ArticleCard],
  selector: 'app-articles-list',
  styles: ``,
  template: `<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-1 gap-y-2 w-full">
    @for (article of articles(); track article.id) {
      <app-article-card [article]="article" />
    }
  </div>`,
})
export class ArticlesList {
  articles = input.required<Article[]>()
}
