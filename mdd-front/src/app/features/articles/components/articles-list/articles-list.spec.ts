import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ArticlesList } from './articles-list';
import { ArticleCard } from '../article-card/article-card';
import { Article } from '../../models/article.interface';

describe('ArticlesList', () => {
  let component: ArticlesList;
  let fixture: ComponentFixture<ArticlesList>;

  const articles: Article[] = [
    {
      id: 1,
      title: 'Article 1',
      content: 'Contenu 1',
      createdAt: new Date('2026-09-10'),
      topic: { id: 1, name: 'Thème 1' },
      author: { id: 1, username: 'JohnDoe' },
    },
    {
      id: 2,
      title: 'Article 2',
      content: 'Contenu 2',
      createdAt: new Date('2026-09-14'),
      topic: { id: 2, name: 'Thème 2' },
      author: { id: 2, username: 'JaneDoe' },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesList],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('articles', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render one app-article-card per article', () => {
    fixture.componentRef.setInput('articles', articles);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-article-card'));
    expect(cards.length).toBe(2);
    expect((cards[0].componentInstance as ArticleCard).article()).toEqual(articles[0]);
    expect((cards[1].componentInstance as ArticleCard).article()).toEqual(articles[1]);
  });

  it('should render nothing when there are no articles', () => {
    fixture.componentRef.setInput('articles', []);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-article-card'));
    expect(cards.length).toBe(0);
  });
});
