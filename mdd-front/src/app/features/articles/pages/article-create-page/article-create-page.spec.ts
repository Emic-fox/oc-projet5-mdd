import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ArticleCreatePage } from './article-create-page';
import { ArticlesService } from '../../services/articles.service';
import { TopicsService } from '@/app/features/topics/services/topics.service';
import { Topic } from '@/app/features/topics/models/topic.interface';
import { Article } from '../../models/article.interface';
import { ApiError } from '@app/core/errors/api-error';

describe('ArticleCreatePage', () => {
  let component: ArticleCreatePage;
  let fixture: ComponentFixture<ArticleCreatePage>;
  let getTopics: ReturnType<typeof vi.fn>;
  let createArticle: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;

  const topics: Topic[] = [
    { id: 1, name: 'Thème 1', description: 'Description 1', subscribed: false },
  ];

  const article: Article = {
    id: 42,
    title: 'Titre',
    content: 'Contenu',
    createdAt: new Date('2026-09-15'),
    topic: { id: 1, name: 'Thème 1' },
    author: { id: 1, username: 'JohnDoe' },
  };

  beforeEach(async () => {
    getTopics = vi.fn().mockReturnValue(of(topics));
    createArticle = vi.fn().mockReturnValue(of(article));
    navigate = vi.fn().mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [ArticleCreatePage],
      providers: [
        { provide: TopicsService, useValue: { getTopics } },
        { provide: ArticlesService, useValue: { createArticle } },
        { provide: Router, useValue: { navigate } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the topics list', () => {
    expect(getTopics).toHaveBeenCalled();
  });

  it('should display the topics returned by the API', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Thème 1');
  });

  it('should create the article and navigate to its detail page on success', () => {
    component.onSubmit({ topicId: 1, title: 'Titre', content: 'Contenu' });

    expect(createArticle).toHaveBeenCalledWith({
      topic_id: 1,
      title: 'Titre',
      content: 'Contenu',
    });
    expect(navigate).toHaveBeenCalledWith(['/articles', 42]);
  });

  const failWith = (init: { status: number; error?: unknown }) =>
    createArticle.mockReturnValue(
      throwError(() => ApiError.from(new HttpErrorResponse(init))),
    );

  it('should display an API error on failure and not navigate', () => {
    failWith({ status: 500 });
    component.onSubmit({ topicId: 1, title: 'Titre', content: 'Contenu' });
    fixture.detectChanges();

    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue');
  });

  it('should clear a previous error on a new submission', () => {
    failWith({ status: 500 });
    component.onSubmit({ topicId: 1, title: 'Titre', content: 'Contenu' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue');

    createArticle.mockReturnValue(of(article));
    component.onSubmit({ topicId: 1, title: 'Titre', content: 'Contenu' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Une erreur est survenue');
  });
});
