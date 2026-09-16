import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ArticleDetailPage } from './article-detail-page';
import { Article } from '../../models/article.interface';
import { Comment } from '../../models/comment.interface';
import { environment } from '@/environments/environment';
import { apiErrorInterceptor } from '@app/core/errors/api-error.interceptor';

const path = `${environment.apiUrl}/api/articles`;
const commentsPath = `${path}/1/comments`;

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

  const comments: Comment[] = [
    {
      id: 1,
      content: 'Super article !',
      createdAt: new Date('2026-09-15'),
      author: { id: 2, username: 'JaneDoe' },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetailPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
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
    httpMock.expectOne(commentsPath).flush(comments);

    expect(component).toBeTruthy();
  });

  it('should request the article matching the route id', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${path}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(article);
    httpMock.expectOne(commentsPath).flush(comments);
  });

  it('should render the article title, content, author and topic', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}/1`).flush(article);
    httpMock.expectOne(commentsPath).flush(comments);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Mon article');
    expect(text).toContain('Le contenu de mon article');
    expect(text).toContain('JohnDoe');
    expect(text).toContain('Thème 1');
  });

  it('should request the comments matching the route id and render them', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}/1`).flush(article);

    const req = httpMock.expectOne(commentsPath);
    expect(req.request.method).toBe('GET');
    req.flush(comments);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Super article !');
    expect(text).toContain('JaneDoe');
  });

  it('should post a new comment and append it to the list', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}/1`).flush(article);
    httpMock.expectOne(commentsPath).flush(comments);
    fixture.detectChanges();

    const newComment: Comment = {
      id: 2,
      content: 'Merci !',
      createdAt: new Date('2026-09-16'),
      author: { id: 3, username: 'BobDoe' },
    };

    component.onCommentSubmitted('Merci !');

    const req = httpMock.expectOne(commentsPath);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content: 'Merci !' });
    req.flush(newComment);
    fixture.detectChanges();

    expect(component.comments()).toEqual([...comments, newComment]);
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Merci !');
    expect(text).toContain('BobDoe');
  });

  it('should display a dedicated message when the article does not exist', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}/1`).flush('Not found', { status: 404, statusText: 'Not Found' });
    httpMock.expectOne(commentsPath).flush(comments);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Article introuvable.');
  });

  it('should display an error when loading the article fails for another reason', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}/1`).flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    httpMock.expectOne(commentsPath).flush(comments);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue. Veuillez réessayer.');
  });

  it('should display an error and an empty list when loading the comments fails', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}/1`).flush(article);
    httpMock.expectOne(commentsPath).flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue. Veuillez réessayer.');
    expect(component.comments()).toEqual([]);
  });
});
