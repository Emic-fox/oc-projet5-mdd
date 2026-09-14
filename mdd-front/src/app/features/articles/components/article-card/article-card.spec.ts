import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { ArticleCard } from './article-card';
import { Article } from '../../models/article.interface';

describe('ArticleCard', () => {
  let component: ArticleCard;
  let fixture: ComponentFixture<ArticleCard>;

  const article: Article = {
    id: 1,
    title: 'Mon article',
    content: 'Le contenu de mon article',
    createdAt: new Date('2026-09-14'),
    topic: { id: 1, name: 'Thème 1' },
    author: { id: 1, username: 'JohnDoe' },
  };

  const setArticle = (overrides: Partial<Article> = {}) => {
    fixture.componentRef.setInput('article', { ...article, ...overrides });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('article', article);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the article title', () => {
    setArticle();

    const title = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(title.textContent?.trim()).toBe('Mon article');
  });

  it('should render the article content', () => {
    setArticle();

    expect(fixture.nativeElement.textContent).toContain('Le contenu de mon article');
  });

  it('should render the author username', () => {
    setArticle();

    expect(fixture.nativeElement.textContent).toContain('JohnDoe');
  });

  it('should render the formatted creation date', () => {
    setArticle();

    const expected = formatDate(article.createdAt, 'mediumDate', TestBed.inject(LOCALE_ID));

    expect(fixture.nativeElement.textContent).toContain(expected);
  });
});
