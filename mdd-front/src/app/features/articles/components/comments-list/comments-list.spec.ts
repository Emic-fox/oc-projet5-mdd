import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsList } from './comments-list';
import { Comment } from '../../models/comment.interface';

describe('CommentsList', () => {
  let component: CommentsList;
  let fixture: ComponentFixture<CommentsList>;

  const comments: Comment[] = [
    {
      id: 1,
      content: 'Commentaire 1',
      createdAt: new Date('2024-01-01'),
      author: { id: 1, username: 'JohnDoe' },
    },
    {
      id: 2,
      content: 'Commentaire 2',
      createdAt: new Date('2024-02-01'),
      author: { id: 2, username: 'JaneDoe' },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsList],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('comments', comments);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one entry per comment with its author and content', () => {
    const items = fixture.nativeElement.querySelectorAll('[data-testid="comment"]');
    expect(items).toHaveLength(2);

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('JohnDoe');
    expect(text).toContain('Commentaire 1');
    expect(text).toContain('JaneDoe');
    expect(text).toContain('Commentaire 2');
  });
});
