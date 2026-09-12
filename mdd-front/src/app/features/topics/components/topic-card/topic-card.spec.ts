import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TopicCard } from './topic-card';
import { Topic } from '../../models/topic.interface';

describe('TopicCard', () => {
  let component: TopicCard;
  let fixture: ComponentFixture<TopicCard>;

  const topic: Topic = {
    id: 1,
    name: 'Thème 1',
    description: 'Description du thème 1',
    subscribed: false,
  };

  const getButton = (): HTMLButtonElement =>
    fixture.debugElement.query(By.css('app-button button')).nativeElement;

  const setTopic = (overrides: Partial<Topic> = {}) => {
    fixture.componentRef.setInput('topic', { ...topic, ...overrides });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('topic', topic);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the topic name and description', () => {
    setTopic();

    const title = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(title.textContent?.trim()).toBe('Thème 1');
    expect(fixture.nativeElement.textContent).toContain('Description du thème 1');
  });

  describe('when not subscribed', () => {
    it('should show an enabled "S\'abonner" button', () => {
      setTopic({ subscribed: false });

      const button = getButton();
      expect(button.textContent?.trim()).toBe("S'abonner");
      expect(button.disabled).toBe(false);
    });

    it('should emit subscribe when clicking the button', () => {
      setTopic({ subscribed: false });
      const subscribeSpy = vi.fn();
      component.subscribe.subscribe(subscribeSpy);

      getButton().click();

      expect(subscribeSpy).toHaveBeenCalled();
    });
  });

  describe('when subscribed and unsubscription allowed (default)', () => {
    it('should show an enabled "Se désabonner" button', () => {
      setTopic({ subscribed: true });

      const button = getButton();
      expect(button.textContent?.trim()).toBe('Se désabonner');
      expect(button.disabled).toBe(false);
    });

    it('should emit unsubscribe when clicking the button', () => {
      setTopic({ subscribed: true });
      const unsubscribeSpy = vi.fn();
      component.unsubscribe.subscribe(unsubscribeSpy);

      getButton().click();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('when subscribed and unsubscription not allowed', () => {
    it('should show a disabled "Déjà abonné" button', () => {
      fixture.componentRef.setInput('allowUnsubcription', false);
      setTopic({ subscribed: true });

      const button = getButton();
      expect(button.textContent?.trim()).toBe('Déjà abonné');
      expect(button.disabled).toBe(true);
    });

    it('should not emit unsubscribe when clicking the button', () => {
      setTopic({ subscribed: false });
      const unsubscribeSpy = vi.fn();
      component.unsubscribe.subscribe(unsubscribeSpy);

      getButton().click();

      expect(unsubscribeSpy).not.toHaveBeenCalled();
    });
  });
});
