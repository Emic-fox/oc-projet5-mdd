import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TopicsList } from './topics-list';
import { Topic } from '../../models/topic.interface';
import { TopicCard } from '../topic-card/topic-card';

describe('TopicsList', () => {
  let component: TopicsList;
  let fixture: ComponentFixture<TopicsList>;

  const topics: Topic[] = [
    { id: 1, name: 'Thème 1', description: 'Description 1', subscribed: false },
    { id: 2, name: 'Thème 2', description: 'Description 2', subscribed: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsList],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('topics', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one topic card per topic', () => {
    fixture.componentRef.setInput('topics', topics);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-topic-card'));
    expect(cards.length).toBe(2);
    expect(cards[0].componentInstance.topic()).toEqual(topics[0]);
    expect(cards[1].componentInstance.topic()).toEqual(topics[1]);
  });

  it('should default allowUnsubcription to true and pass it down to each card', () => {
    fixture.componentRef.setInput('topics', topics);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-topic-card'));
    expect(component.allowUnsubcription()).toBe(true);
    cards.forEach((card) => {
      expect((card.componentInstance as TopicCard).allowUnsubcription()).toBe(true);
    });
  });

  it('should forward allowUnsubcription set to false to each card', () => {
    fixture.componentRef.setInput('topics', topics);
    fixture.componentRef.setInput('allowUnsubcription', false);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-topic-card'));
    cards.forEach((card) => {
      expect((card.componentInstance as TopicCard).allowUnsubcription()).toBe(false);
    });
  });

  it('should render nothing when the topics list is empty', () => {
    fixture.componentRef.setInput('topics', []);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('app-topic-card')).length).toBe(0);
  });
});
