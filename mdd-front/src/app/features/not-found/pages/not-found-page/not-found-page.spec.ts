import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NotFoundPage } from './not-found-page';

describe('NotFoundPage', () => {
  let fixture: ComponentFixture<NotFoundPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundPage);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display a message and a link back to the home page', () => {
    const title = fixture.debugElement.query(By.css('[data-testid="not-found-title"]'));
    const link = fixture.debugElement.query(By.css('[data-testid="not-found-home-link"]'));

    expect(title).not.toBeNull();
    expect(link.nativeElement.getAttribute('href')).toBe('/');
  });
});
