import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ArticleDetailPage } from './article-detail-page';
import { Article } from '../../models/article.interface';
import { environment } from '@/environments/environment';

const path = `${environment.apiUrl}/api/articles`;

describe('ArticleDetailPage', () => {
  let component: ArticleDetailPage;
  let fixture: ComponentFixture<ArticleDetailPage>;
  let httpMock: HttpTestingController;

  const article: Article = {
    id: 1,
    title: 'Mon article',
    content: 'Le contenu de mon article',
    createdAt: new Date('2026-09-14'),
    topic: { id: 1, name: 'Thème 1' },
    author: { id: 1, username: 'JohnDoe' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetailPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: '1' })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleDetailPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}/1`).flush(article);

    expect(component).toBeTruthy();
  });

  it('should request the article matching the route id', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${path}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(article);
  });

  it('should render the article title, content, author and topic', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}/1`).flush(article);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Mon article');
    expect(text).toContain('Le contenu de mon article');
    expect(text).toContain('JohnDoe');
    expect(text).toContain('Thème 1');
  });
});
