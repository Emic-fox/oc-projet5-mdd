import { Component, input } from '@angular/core';
import { Comment } from '../../models/comment.interface';

@Component({
  imports: [],
  selector: 'app-comments-list',
  template: `<ul class="flex flex-col gap-3 w-full">
    @for (comment of comments(); track comment.id) {
      <li class="flex flex-col gap-1 items-end md:flex-row md:items-start md:gap-3" data-testid="comment">
        <span class="font-medium md:w-32" data-testid="comment-author">{{ comment.author.username }}</span>
        <p class="bg-neutral-100 rounded-xl px-4 py-2 whitespace-pre-line w-full" data-testid="comment-content">{{ comment.content }}</p>
      </li>
    }
  </ul>`,
})
export class CommentsList {
  comments = input.required<Comment[]>();
}
