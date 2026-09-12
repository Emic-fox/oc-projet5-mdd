import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { PrivateLayout } from './private-layout';

describe('PrivateLayout', () => {
  let component: PrivateLayout;
  let fixture: ComponentFixture<PrivateLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivateLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header logo in small size', () => {
    fixture.detectChanges();

    const logo = fixture.debugElement.query(By.css('header app-logo'));
    expect(logo).not.toBeNull();
    expect(logo.attributes['size']).toBe('small');
  });

  it('should render the router outlet', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('main router-outlet'))).not.toBeNull();
  });
});
