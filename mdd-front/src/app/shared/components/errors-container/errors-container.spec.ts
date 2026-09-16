import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ErrorsContainer } from './errors-container';

describe('ErrorsContainer', () => {
  let component: ErrorsContainer;
  let fixture: ComponentFixture<ErrorsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorsContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorsContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render nothing when there is no message', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[data-testid="content-error"]'))).toBeNull();
  });

  it('should render the message with an alert role when set', () => {
    fixture.componentRef.setInput('message', 'Impossible de charger les articles.');
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('[data-testid="content-error"]')).nativeElement;
    expect(el.textContent).toContain('Impossible de charger les articles.');
    expect(el.getAttribute('role')).toBe('alert');
  });
});
