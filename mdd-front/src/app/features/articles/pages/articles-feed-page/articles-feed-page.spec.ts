import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ArticlesFeedPage } from './articles-feed-page';
import { ArticlesList } from '../../components/articles-list/articles-list';
import { SortBy } from '@/app/shared/components/sort-by/sort-by';
import { Article } from '../../models/article.interface';
import { environment } from '@/environments/environment';
import { apiErrorInterceptor } from '@app/core/errors/api-error.interceptor';

const path = `${environment.apiUrl}/api/articles`;

describe('ArticlesFeedPage', () => {
  let component: ArticlesFeedPage;
  let fixture: ComponentFixture<ArticlesFeedPage>;
  let httpMock: HttpTestingController;
  let router: Router;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesFeedPage],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesFeedPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}?sort=desc`).flush(articles);

    expect(component).toBeTruthy();
  });

  it('should request the articles sorted by descending order by default', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${path}?sort=desc`);
    expect(req.request.method).toBe('GET');
    req.flush(articles);
  });

  it('should render the articles list with the articles fetched from the service', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}?sort=desc`).flush(articles);
    fixture.detectChanges();

    const articlesList = fixture.debugElement.query(By.css('app-articles-list'));
    expect(articlesList).not.toBeNull();
    expect((articlesList.componentInstance as ArticlesList).articles()).toEqual(articles);
  });

  it('should render an empty list while the articles are loading', () => {
    fixture.detectChanges();

    const articlesList = fixture.debugElement.query(By.css('app-articles-list'));
    expect((articlesList.componentInstance as ArticlesList).articles()).toEqual([]);

    httpMock.expectOne(`${path}?sort=desc`).flush(articles);
  });

  it('should navigate to /new-article when clicking the create button', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}?sort=desc`).flush(articles);
    fixture.detectChanges();

    const createButton = fixture.debugElement.query(By.css('app-button button'));
    createButton.nativeElement.click();

    expect(router.navigate).toHaveBeenCalledWith(['/new-article']);
  });

  it('should re-request the articles with the new order when the sort order is toggled', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}?sort=desc`).flush(articles);
    fixture.detectChanges();

    const sortBy = fixture.debugElement.query(By.css('app-sort-by'))
      .componentInstance as SortBy;
    sortBy.toggle();
    fixture.detectChanges();

    const req = httpMock.expectOne(`${path}?sort=asc`);
    expect(req.request.method).toBe('GET');
    req.flush([...articles].reverse());
    fixture.detectChanges();

    expect(component.order()).toBe('asc');
  });

  it('should display an error and an empty list when loading the articles fails', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}?sort=desc`).flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue. Veuillez réessayer.');
    const articlesList = fixture.debugElement.query(By.css('app-articles-list'));
    expect((articlesList.componentInstance as ArticlesList).articles()).toEqual([]);
  });

  it('should recover once the sort order changes again after a failed load', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${path}?sort=desc`).flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue. Veuillez réessayer.');

    const sortBy = fixture.debugElement.query(By.css('app-sort-by'))
      .componentInstance as SortBy;
    sortBy.toggle();
    fixture.detectChanges();

    const req = httpMock.expectOne(`${path}?sort=asc`);
    req.flush(articles);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Une erreur est survenue. Veuillez réessayer.');
    const articlesList = fixture.debugElement.query(By.css('app-articles-list'));
    expect((articlesList.componentInstance as ArticlesList).articles()).toEqual(articles);
  });
});
