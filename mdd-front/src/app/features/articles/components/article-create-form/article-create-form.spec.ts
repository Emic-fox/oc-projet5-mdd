import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCreateForm, ArticleCreateFormData } from './article-create-form';
import { Topic } from '@/app/features/topics/models/topic.interface';

describe('ArticleCreateForm', () => {
  let component: ArticleCreateForm;
  let fixture: ComponentFixture<ArticleCreateForm>;

  const topics: Topic[] = [
    { id: 1, name: 'Thème 1', description: 'Description 1', subscribed: false },
    { id: 2, name: 'Thème 2', description: 'Description 2', subscribed: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCreateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCreateForm);
    fixture.componentRef.setInput('topics', topics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const setModel = async (topicId: number | null, title: string, content: string) => {
    component.articleModel.set({ topicId, title, content });
    await fixture.whenStable();
  };

  const messages = (errors: readonly { message?: string }[]) => errors.map((e) => e.message);

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty model', () => {
    expect(component.articleModel()).toEqual({ title: '', content: '', topicId: null });
  });

  it('should map the topics input to select options', () => {
    expect(component.topicOptions()).toEqual([
      { value: 1, label: 'Thème 1' },
      { value: 2, label: 'Thème 2' },
    ]);
  });

  it('should be invalid when empty', () => {
    expect(component.articleForm().invalid()).toBe(true);
  });

  it('should require the topic', async () => {
    await setModel(null, 'Titre', 'Contenu');
    expect(messages(component.articleForm.topicId().errors())).toContain(
      'Le thème est obligatoire',
    );
  });

  it('should require the title', async () => {
    await setModel(1, '', 'Contenu');
    expect(messages(component.articleForm.title().errors())).toContain(
      'Le titre est obligatoire',
    );
  });

  it('should require the content', async () => {
    await setModel(1, 'Titre', '');
    expect(messages(component.articleForm.content().errors())).toContain(
      'Le contenu est obligatoire',
    );
  });

  it('should be valid when the topic, title and content are filled', async () => {
    await setModel(1, 'Titre', 'Contenu');
    expect(component.articleForm().valid()).toBe(true);
  });

  it('should disable the submit button while invalid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should enable the submit button once valid', async () => {
    await setModel(1, 'Titre', 'Contenu');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(false);
  });

  it('should prevent the default form submission', () => {
    const event = new Event('submit');
    const preventDefault = vi.spyOn(event, 'preventDefault');
    component.onSubmit(event);
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should emit the current data on submit', async () => {
    const emitted: ArticleCreateFormData[] = [];
    component.submitted.subscribe((value) => emitted.push(value));
    await setModel(1, 'Titre', 'Contenu');
    component.onSubmit(new Event('submit'));
    await fixture.whenStable();
    expect(emitted).toEqual([{ topicId: 1, title: 'Titre', content: 'Contenu' }]);
  });

  it('should not emit when the form is invalid', async () => {
    const emitted: ArticleCreateFormData[] = [];
    component.submitted.subscribe((value) => emitted.push(value));
    await setModel(null, '', '');
    component.onSubmit(new Event('submit'));
    await fixture.whenStable();
    expect(emitted).toEqual([]);
  });

  it('should render the global error when set', () => {
    fixture.componentRef.setInput('globalError', "Échec de la création de l'article.");
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("Échec de la création de l'article.");
  });

  it('should render nothing when there is no global error', () => {
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[data-testid="content-error"]'),
    ).toBeNull();
  });
});
