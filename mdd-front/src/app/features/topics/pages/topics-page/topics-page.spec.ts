import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TopicsPage } from './topics-page';
import { TopicsList } from '../../components/topics-list/topics-list';
import { Topic } from '../../models/topic.interface';
import { environment } from '@/environments/environment';

const url = `${environment.apiUrl}/api/topics?subscribed=false`;

describe('TopicsPage', () => {
  const topics: Topic[] = [
    { id: 1, name: 'Thème 1', description: 'Description 1', subscribed: false },
    { id: 2, name: 'Thème 2', description: 'Description 2', subscribed: true },
  ];

  let fixture: ComponentFixture<TopicsPage>;
  let component: TopicsPage;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpMock.expectOne(url).flush(topics);

    expect(component).toBeTruthy();
  });

  it('should request only the unsubscribed topics', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(topics);
  });

  it('should render the topics list with the topics fetched from the service', () => {
    fixture.detectChanges();
    httpMock.expectOne(url).flush(topics);
    fixture.detectChanges();

    const topicsList = fixture.debugElement.query(By.css('app-topics-list'));
    expect(topicsList).not.toBeNull();
    expect((topicsList.componentInstance as TopicsList).topics()).toEqual(topics);
  });

  it('should render an empty list while the topics are loading', () => {
    fixture.detectChanges();

    const topicsList = fixture.debugElement.query(By.css('app-topics-list'));
    expect((topicsList.componentInstance as TopicsList).topics()).toEqual([]);

    httpMock.expectOne(url).flush(topics);
  });

  it('should not allow unsubscription from this page', () => {
    fixture.detectChanges();
    httpMock.expectOne(url).flush(topics);
    fixture.detectChanges();

    const topicsList = fixture.debugElement.query(By.css('app-topics-list'));
    expect((topicsList.componentInstance as TopicsList).allowUnsubcription()).toBe(false);
  });
});
