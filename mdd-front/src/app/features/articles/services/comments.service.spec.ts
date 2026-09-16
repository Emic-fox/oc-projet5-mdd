import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CommentsService } from './comments.service';
import { Comment } from '../models/comment.interface';
import { environment } from '@/environments/environment';

const url = `${environment.apiUrl}/api/articles/1/comments`;

describe('CommentsService', () => {
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

  let service: CommentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CommentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the comments of an article', () => {
    service.getComments(1).subscribe((result) => {
      expect(result).toEqual(comments);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(comments);
  });

  it('should post a new comment', () => {
    service.createComment(1, 'Commentaire 1').subscribe((result) => {
      expect(result).toEqual(comments[0]);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content: 'Commentaire 1' });
    req.flush(comments[0]);
  });
});
