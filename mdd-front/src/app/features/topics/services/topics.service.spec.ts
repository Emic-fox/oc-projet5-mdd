import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TopicsService } from './topics.service';
import { Topic } from '../models/topic.interface';
import { environment } from '@/environments/environment';

const url = `${environment.apiUrl}/api/topics`;

describe('TopicsService', () => {
  const topics: Topic[] = [
    { id: 1, name: 'Thème 1', description: 'Description 1', subscribed: false },
    { id: 2, name: 'Thème 2', description: 'Description 2', subscribed: true },
  ];

  let service: TopicsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TopicsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the topics without params by default', () => {
    service.getTopics().subscribe((result) => {
      expect(result).toEqual(topics);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(topics);
  });

  it('should forward the subscribed filter as a query param', () => {
    service.getTopics({ subscribed: true }).subscribe();

    const req = httpMock.expectOne(`${url}?subscribed=true`);
    expect(req.request.params.get('subscribed')).toBe('true');
    req.flush(topics);
  });
});
