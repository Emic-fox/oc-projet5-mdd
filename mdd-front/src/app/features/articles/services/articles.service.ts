import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Article } from '../models/article.interface';
import { GetArticlesRequest } from '../models/get-articles-request.interface';

@Service()
export class ArticlesService {
  private http = inject(HttpClient);
  
  private path = `${environment.apiUrl}/api/articles`;

  getArticles(request: GetArticlesRequest = {}) {
      return this.http.get<Article[]>(this.path, { params: { ...request } });
  }

  getArticle(id: number) {
      return this.http.get<Article>(`${this.path}/${id}`);
  }
}
