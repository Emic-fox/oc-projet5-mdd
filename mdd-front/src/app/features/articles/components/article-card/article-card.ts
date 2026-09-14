import { Component, input } from '@angular/core';
import { Card } from '@/app/shared/components/card/card';
import { Article } from '../../models/article.interface';
import { DatePipe } from '@angular/common';

@Component({
  imports: [Card, DatePipe],
  selector: 'app-article-card',
  styles: ``,
  template: `<app-card>
    <ng-content label>{{ article().title }}</ng-content>
    <div class="w-full grid grid-cols-2">
      <span>{{ article().createdAt | date }}</span>
      <span>{{ article().author.username }}</span>
    </div>
    <p class="grow line-clamp-5">{{ article().content }}</p>
  </app-card>`,
})
export class ArticleCard {
  article = input.required<Article>();
}
