import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentCreateForm } from './comment-create-form';

describe('CommentCreateForm', () => {
  let component: CommentCreateForm;
  let fixture: ComponentFixture<CommentCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCreateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentCreateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty content', () => {
    expect(component.content()).toBe('');
  });

  it('should disable the submit button while empty', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-testid="comment-submit"]');
    expect(button.disabled).toBe(true);
  });

  it('should enable the submit button once content is entered', () => {
    component.content.set('Un commentaire');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-testid="comment-submit"]');
    expect(button.disabled).toBe(false);
  });

  it('should prevent the default form submission', () => {
    const event = new Event('submit');
    const preventDefault = vi.spyOn(event, 'preventDefault');
    component.onSubmit(event);
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should emit the trimmed content and reset the field on submit', () => {
    const emitted: string[] = [];
    component.submitted.subscribe((value) => emitted.push(value));

    component.content.set('  Un commentaire  ');
    component.onSubmit(new Event('submit'));

    expect(emitted).toEqual(['Un commentaire']);
    expect(component.content()).toBe('');
  });

  it('should not emit when the content is blank', () => {
    const emitted: string[] = [];
    component.submitted.subscribe((value) => emitted.push(value));

    component.content.set('   ');
    component.onSubmit(new Event('submit'));

    expect(emitted).toEqual([]);
  });
});
