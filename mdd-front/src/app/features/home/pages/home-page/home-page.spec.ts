import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the large logo', () => {
    const logo = fixture.debugElement.query(By.css('app-logo'));

    expect(logo).not.toBeNull();
    expect(logo.attributes['size']).toBe('large');
    expect(logo.query(By.css('img')).nativeElement.className).toContain('h-32');
  });

  it('should render the login and register buttons', () => {
    const labels = fixture.debugElement
      .queryAll(By.css('app-button'))
      .map((button) => button.nativeElement.textContent.trim());

    expect(labels).toEqual(['Se connecter', "S'inscrire"]);
  });

  it('should use the secondary variant for both buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('app-button button'));

    expect(buttons.length).toBe(2);
    buttons.forEach((button) => {
      expect(button.nativeElement.className).toContain('bg-white');
    });
  });
});
