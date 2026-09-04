import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Logo } from './logo';

describe('Logo', () => {
  let component: Logo;
  let fixture: ComponentFixture<Logo>;

  const getImg = (): HTMLImageElement =>
    fixture.debugElement.query(By.css('img')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logo],
    }).compileComponents();

    fixture = TestBed.createComponent(Logo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an img with src and alt', () => {
    fixture.detectChanges();
    const img = getImg();

    expect(img.getAttribute('src')).toBe('logo.svg');
    expect(img.getAttribute('alt')).toBe('MDD');
  });

  it('should default to the small size classes', () => {
    fixture.detectChanges();

    expect(component.size()).toBe('small');
    const classes = getImg().className;
    expect(classes).toContain('h-12');
    expect(classes).toContain('lg:h-20');
    expect(classes).toContain('w-auto');
  });

  it('should apply the large size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const classes = getImg().className;
    expect(classes).toContain('h-32');
    expect(classes).toContain('lg:h-60');
    expect(classes).toContain('w-auto');
    expect(classes).not.toContain('h-12');
  });
});
