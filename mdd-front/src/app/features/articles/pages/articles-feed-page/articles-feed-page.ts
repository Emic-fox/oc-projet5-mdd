import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ArticlesService } from '../../services/articles.service';
import { ArticlesList } from '../../components/articles-list/articles-list';
import { Button } from '@/app/shared/components/button/button';
import { SortBy } from '@/app/shared/components/sort-by/sort-by';
import { Router } from '@angular/router';

@Component({
  imports: [ArticlesList, Button, SortBy],
  selector: 'app-articles-feed-page',
  template: `
  <div class="flex items-center gap-2 max-md:flex-col md:justify-between mb-4">
    <app-button data-testid="create-article" (click)="router.navigate(['/new-article'])">Créer un article</app-button>
    <app-sort-by [(order)]="order" />
  </div>
  <app-articles-list [articles]="articles() ?? []" />
  `,
})
export class ArticlesFeedPage {
  router = inject(Router)
  articlesService = inject(ArticlesService)

  order = signal<'asc'|'desc'>('desc')

  articles = toSignal(
    toObservable(this.order).pipe(
      switchMap((sort) => this.articlesService.getArticles({ sort })),
    ),
  );
}
