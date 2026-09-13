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

  it('should mark the matching topic as subscribed when the list emits subscribe', () => {
    fixture.detectChanges();
    httpMock.expectOne(url).flush(topics);
    fixture.detectChanges();

    const topicsList = fixture.debugElement.query(By.css('app-topics-list'))
      .componentInstance as TopicsList;
    topicsList.subscribe.emit(1);
    fixture.detectChanges();

    expect(topicsList.topics()).toEqual([
      { ...topics[0], subscribed: true },
      topics[1],
    ]);
  });

  it('should mark the matching topic as unsubscribed when the list emits unsubscribe', () => {
    fixture.detectChanges();
    httpMock.expectOne(url).flush(topics);
    fixture.detectChanges();

    const topicsList = fixture.debugElement.query(By.css('app-topics-list'))
      .componentInstance as TopicsList;
    topicsList.unsubscribe.emit(2);
    fixture.detectChanges();

    expect(topicsList.topics()).toEqual([
      topics[0],
      { ...topics[1], subscribed: false },
    ]);
  });

  it('should not affect other topics when updating a subscription', () => {
    fixture.detectChanges();
    httpMock.expectOne(url).flush(topics);
    fixture.detectChanges();

    const topicsList = fixture.debugElement.query(By.css('app-topics-list'))
      .componentInstance as TopicsList;
    topicsList.subscribe.emit(1);
    fixture.detectChanges();

    expect(topicsList.topics()[1]).toBe(topics[1]);
  });

  it('should update the rendered button after subscribing to a topic', () => {
    fixture.detectChanges();
    httpMock.expectOne(url).flush(topics);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('app-button button'));
    const button = buttons[0].nativeElement as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe("S'abonner");
    expect(button.disabled).toBe(false);

    button.click();
    httpMock.expectOne(`${environment.apiUrl}/api/topics/1/subscription`).flush({});
    fixture.detectChanges();

    expect(button.textContent?.trim()).toBe('Déjà abonné');
    expect(button.disabled).toBe(true);
  });
});
