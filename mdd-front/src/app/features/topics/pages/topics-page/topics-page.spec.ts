import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TopicsPage } from './topics-page';
import { TopicsList } from '../../components/topics-list/topics-list';

describe('TopicsPage', () => {
  let component: TopicsPage;
  let fixture: ComponentFixture<TopicsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: les thèmes sont pour l'instant en dur en attendant le chargement via le service.
  it('should expose a non-empty list of topics', () => {
    expect(component.topics.length).toBeGreaterThan(0);
  });

  it('should render the topics list with the page topics', () => {
    fixture.detectChanges();

    const topicsList = fixture.debugElement.query(By.css('app-topics-list'));
    expect(topicsList).not.toBeNull();
    expect((topicsList.componentInstance as TopicsList).topics()).toBe(component.topics);
  });

  it('should not allow unsubscription from this page', () => {
    fixture.detectChanges();

    const topicsList = fixture.debugElement.query(By.css('app-topics-list'));
    expect((topicsList.componentInstance as TopicsList).allowUnsubcription()).toBe(false);
  });
});
