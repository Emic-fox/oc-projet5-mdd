import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ArticlesService } from '../../services/articles.service';
import { CommentsService } from '../../services/comments.service';
import { Comment } from '../../models/comment.interface';
import { BackLink } from '@shared/components/back-link/back-link';
import { CommentsList } from '../../components/comments-list/comments-list';
import { CommentCreateForm } from '../../components/comment-create-form/comment-create-form';

@Component({
  imports: [DatePipe, BackLink, CommentsList, CommentCreateForm],
  selector: 'app-article-detail-page',
  template: `
  <div class="grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-4">
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
  private route = inject(ActivatedRoute);
  private articlesService = inject(ArticlesService);
  private commentsService = inject(CommentsService);
  private destroyRef = inject(DestroyRef);

  private id$ = this.route.paramMap.pipe(map((params) => Number(params.get('id'))));

  article = toSignal(this.id$.pipe(switchMap((id) => this.articlesService.getArticle(id))));

  comments = signal<Comment[]>([]);

  constructor() {
    this.id$
      .pipe(
        switchMap((id) => this.commentsService.getComments(id)),
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
