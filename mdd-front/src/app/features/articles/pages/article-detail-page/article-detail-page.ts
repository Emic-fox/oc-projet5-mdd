import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ArticlesService } from '../../services/articles.service';
import { CommentsService } from '../../services/comments.service';
import { Comment } from '../../models/comment.interface';
import { BackLink } from '@shared/components/back-link/back-link';
import { CommentsList } from '../../components/comments-list/comments-list';
import { CommentCreateForm } from '../../components/comment-create-form/comment-create-form';
import { ApiError } from '@app/core/errors/api-error';
import { ErrorsContainer } from '@shared/components/errors-container/errors-container';

@Component({
  imports: [DatePipe, BackLink, CommentsList, CommentCreateForm, ErrorsContainer],
  selector: 'app-article-detail-page',
  template: `
  <div class="grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-4">
    <app-errors-container class="col-span-2 block" [message]="error()" />

    <app-back-link class="self-center" to="/articles" label="Retour aux articles" />

    <section class="contents">
      <h1 class="col-start-2 text-2xl font-bold">{{ article()?.title }}</h1>

      <div class="max-md:col-span-2 md:col-start-2 flex flex-wrap gap-8">
        <span data-testid="article-date">{{ article()?.createdAt | date }}</span>
        <span data-testid="article-author">{{ article()?.author?.username }}</span>
        <span data-testid="article-topic">{{ article()?.topic?.name }}</span>
      </div>

      <p class="max-md:col-span-2 md:col-start-2 whitespace-pre-line" data-testid="article-content">{{ article()?.content }}</p>
    </section>

    <hr class="max-md:col-span-2 md:col-start-2 w-full border-t" />

    <section class="contents">
      <h2 class="max-md:col-span-2 md:col-start-2 text-lg font-bold">Commentaires</h2>
      <app-comments-list class="max-md:col-span-2 md:col-start-2 md:mx-12" [comments]="comments()" />
      <app-comment-create-form class="max-md:col-span-2 md:col-start-2 md:mx-12" (submitted)="onCommentSubmitted($event)" />
    </section>
  </div>
  `,
})
export class ArticleDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly articlesService = inject(ArticlesService);
  private readonly commentsService = inject(CommentsService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly id$ = this.route.paramMap.pipe(map((params) => Number(params.get('id'))));

  error = signal<string | null>(null);

  article = toSignal(
    this.id$.pipe(
      switchMap((id) =>
        this.articlesService.getArticle(id).pipe(
          catchError((err: ApiError) => {
            this.error.set(err.messageFor({ 404: 'Article introuvable.' }));
            return of(undefined);
          }),
        ),
      ),
    ),
  );

  comments = signal<Comment[]>([]);

  constructor() {
    this.id$
      .pipe(
        switchMap((id) =>
          this.commentsService.getComments(id).pipe(
            catchError((err: ApiError) => {
              this.error.set(err.message);
              return of([]);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((comments) => this.comments.set(comments));
  }

  onCommentSubmitted(content: string) {
    const articleId = this.article()?.id;
    if (articleId == null) return;

    this.commentsService
      .createComment(articleId, content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comment) => this.comments.update((comments) => [...comments, comment]));
  }
}
