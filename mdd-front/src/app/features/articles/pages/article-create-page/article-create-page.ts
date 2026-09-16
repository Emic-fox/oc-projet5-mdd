import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ArticleCreateForm, ArticleCreateFormData } from '../../components/article-create-form/article-create-form';
import { ArticlesService } from '../../services/articles.service';
import { TopicsService } from '@/app/features/topics/services/topics.service';
import { BackLink } from '@shared/components/back-link/back-link';
import { ApiError } from '@app/core/errors/api-error';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [ArticleCreateForm, BackLink, AsyncPipe],
  selector: 'app-article-create-page',
  template: `
  <div class="grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-4">
    <app-back-link class="self-center" to="/articles" label="Retour aux articles" />
    <h1 class="text-2xl font-bold text-center self-center">Créer un nouvel article</h1>

    <app-article-create-form class="col-start-2" [topics]="(topics$ | async) ?? []" [globalError]="error()" (submitted)="onSubmit($event)" />
  </div>
  `,
})
export class ArticleCreatePage {
  private topicsService = inject(TopicsService);
  private articlesService = inject(ArticlesService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  protected topics$ = this.topicsService.getTopics();
  protected error = signal<string | null>(null);

  onSubmit(data: ArticleCreateFormData) {
    this.error.set(null);
    this.articlesService
      .createArticle({ topic_id: data.topicId!, title: data.title, content: data.content })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (article) => this.router.navigate(['/articles', article.id]),
        error: (err: ApiError) => this.error.set(err.message),
      });
  }
}
