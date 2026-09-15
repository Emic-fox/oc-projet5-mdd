import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ArticlesService } from '../../services/articles.service';
import { BackLink } from '@shared/components/back-link/back-link';

@Component({
  imports: [DatePipe, BackLink],
  selector: 'app-article-detail-page',
  template: `
  <div class="grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-4">
    <app-back-link class="self-center" to="/articles" label="Retour aux articles" />
    <h1 class="text-2xl font-bold">{{ article()?.title }}</h1>
    <div class="col-start-2 flex flex-wrap gap-8">
      <span data-testid="article-date">{{ article()?.createdAt | date }}</span>
      <span data-testid="article-author">{{ article()?.author?.username }}</span>
      <span data-testid="article-topic">{{ article()?.topic?.name }}</span>
    </div>
    <p class="col-start-2 whitespace-pre-line" data-testid="article-content">{{ article()?.content }}</p>
  </div>
  `,
})
export class ArticleDetailPage {
  private route = inject(ActivatedRoute);
  private articlesService = inject(ArticlesService);

  article = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => this.articlesService.getArticle(Number(params.get('id')))),
    ),
  );
}
