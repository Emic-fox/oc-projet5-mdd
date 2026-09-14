import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SortBy } from './sort-by';

describe('SortBy', () => {
  let component: SortBy;
  let fixture: ComponentFixture<SortBy>;

  const getButton = (): HTMLButtonElement =>
    fixture.debugElement.query(By.css('button')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortBy],
    }).compileComponents();

    fixture = TestBed.createComponent(SortBy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to ascending order', () => {
    fixture.detectChanges();

    expect(component.order()).toBe('asc');
  });

  it('should render the ascending arrow and aria-label when order is asc', () => {
    fixture.componentRef.setInput('order', 'asc');
    fixture.detectChanges();

    const button = getButton();
    expect(button.textContent).toContain('↑');
    expect(button.getAttribute('aria-label')).toBe(
      'Trier par ordre croissant, cliquer pour trier par ordre décroissant',
    );
  });

  it('should render the descending arrow and aria-label when order is desc', () => {
    fixture.componentRef.setInput('order', 'desc');
    fixture.detectChanges();

    const button = getButton();
    expect(button.textContent).toContain('↓');
    expect(button.getAttribute('aria-label')).toBe(
      'Trier par ordre décroissant, cliquer pour trier par ordre croissant',
    );
  });

  it('should toggle the order from asc to desc when clicked', () => {
    fixture.componentRef.setInput('order', 'asc');
    fixture.detectChanges();

    getButton().click();
    fixture.detectChanges();

    expect(component.order()).toBe('desc');
  });

  it('should toggle the order from desc to asc when clicked', () => {
    fixture.componentRef.setInput('order', 'desc');
    fixture.detectChanges();

    getButton().click();
    fixture.detectChanges();

    expect(component.order()).toBe('asc');
  });

  it('should emit the new order via the two-way binding model', () => {
    fixture.detectChanges();
    const orderChangeSpy = vi.fn();
    component.order.subscribe(orderChangeSpy);

    getButton().click();

    expect(orderChangeSpy).toHaveBeenCalledWith('desc');
  });
});
