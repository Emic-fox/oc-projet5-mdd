import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Comment } from '../models/comment.interface';

@Service()
export class CommentsService {
  private http = inject(HttpClient);

  private path = (articleId: number) => `${environment.apiUrl}/api/articles/${articleId}/comments`;

  getComments(articleId: number) {
      return this.http.get<Comment[]>(this.path(articleId));
  }

  createComment(articleId: number, content: string) {
      return this.http.post<Comment>(this.path(articleId), { content });
  }
}
