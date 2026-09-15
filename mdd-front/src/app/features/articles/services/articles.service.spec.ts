import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ArticlesService } from './articles.service';
import { Article } from '../models/article.interface';
import { environment } from '@/environments/environment';

const url = `${environment.apiUrl}/api/articles`;

describe('ArticlesService', () => {
  const articles: Article[] = [
    {
      id: 1,
      title: 'Article 1',
      content: 'Contenu 1',
      createdAt: new Date('2024-01-01'),
      topic: { id: 1, name: 'Thème 1' },
      author: { id: 1, username: 'JohnDoe' },
    },
    {
      id: 2,
      title: 'Article 2',
      content: 'Contenu 2',
      createdAt: new Date('2024-02-01'),
      topic: { id: 2, name: 'Thème 2' },
      author: { id: 2, username: 'JaneDoe' },
    },
  ];

  let service: ArticlesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ArticlesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the articles without params by default', () => {
    service.getArticles().subscribe((result) => {
      expect(result).toEqual(articles);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(articles);
  });

  it('should forward the sort order as a query param', () => {
    service.getArticles({ sort: 'asc' }).subscribe();

    const req = httpMock.expectOne(`${url}?sort=asc`);
    expect(req.request.params.get('sort')).toBe('asc');
    req.flush(articles);
  });

  it('should request a single article by id', () => {
    service.getArticle(1).subscribe((result) => {
      expect(result).toEqual(articles[0]);
    });

    const req = httpMock.expectOne(`${url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(articles[0]);
  });
});
