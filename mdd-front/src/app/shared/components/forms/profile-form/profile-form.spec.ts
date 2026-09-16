import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileForm, ProfileFormData } from './profile-form';

describe('ProfileForm', () => {
  let component: ProfileForm;
  let fixture: ComponentFixture<ProfileForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileForm);
    fixture.componentRef.setInput('submitLabel', "S'inscrire");
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const setModel = async (username: string, email: string, password: string) => {
    component.profileModel.set({ username, email, password });
    await fixture.whenStable();
  };

  const messages = (errors: readonly { message?: string }[]) =>
    errors.map((e) => e.message);

  const validPassword = 'Abcdef1!';

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty model', () => {
    expect(component.profileModel()).toEqual({ username: '', email: '', password: '' });
  });

  it('should pre-fill the username and email from initialData', async () => {
    fixture.componentRef.setInput('initialData', { username: 'john', email: 'john.doe@example.com' });
    await fixture.whenStable();
    expect(component.profileModel()).toEqual({
      username: 'john',
      email: 'john.doe@example.com',
      password: '',
    });
  });

  it('should display the given submit label', async () => {
    fixture.componentRef.setInput('submitLabel', 'Sauvegarder');
    await fixture.whenStable();
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.textContent?.trim()).toBe('Sauvegarder');
  });

  it('should be invalid when empty', () => {
    expect(component.profileForm().invalid()).toBe(true);
  });

  it('should require the username', async () => {
    await setModel('', 'john.doe@example.com', validPassword);
    expect(messages(component.profileForm.username().errors())).toContain(
      "Le nom d'utilisateur est obligatoire",
    );
  });

  it('should require the email', async () => {
    await setModel('john', '', validPassword);
    expect(messages(component.profileForm.email().errors())).toContain(
      "L'adresse e-mail est obligatoire",
    );
  });

  it('should reject a malformed email', async () => {
    await setModel('john', 'not-an-email', validPassword);
    expect(messages(component.profileForm.email().errors())).toContain(
      "L'adresse e-mail doit être valide",
    );
  });

  it('should require the password', async () => {
    await setModel('john', 'john.doe@example.com', '');
    expect(messages(component.profileForm.password().errors())).toContain(
      "Le mot de passe est obligatoire",
    );
  });

  it('should reject a password shorter than 8 characters', async () => {
    await setModel('john', 'john.doe@example.com', 'Ab1!');
    expect(messages(component.profileForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 8 caractères',
    );
  });

  it('should require a digit in the password', async () => {
    await setModel('john', 'john.doe@example.com', 'Abcdefg!');
    expect(messages(component.profileForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 1 chiffre',
    );
  });

  it('should require a lowercase letter in the password', async () => {
    await setModel('john', 'john.doe@example.com', 'ABCDEF1!');
    expect(messages(component.profileForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 1 minuscule',
    );
  });

  it('should require an uppercase letter in the password', async () => {
    await setModel('john', 'john.doe@example.com', 'abcdef1!');
    expect(messages(component.profileForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 1 majuscule',
    );
  });

  it('should require a special character in the password', async () => {
    await setModel('john', 'john.doe@example.com', 'Abcdef12');
    expect(messages(component.profileForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 1 caractère spécial',
    );
  });

  it('should be valid with a well-formed username, email and password', async () => {
    await setModel('john', 'john.doe@example.com', validPassword);
    expect(component.profileForm().valid()).toBe(true);
  });

  it('should disable the submit button while invalid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should enable the submit button once valid', async () => {
    await setModel('john', 'john.doe@example.com', validPassword);
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
    const emitted: ProfileFormData[] = [];
    component.submitted.subscribe((value) => emitted.push(value));
    await setModel('john', 'john.doe@example.com', validPassword);
    component.onSubmit(new Event('submit'));
    await fixture.whenStable();
    expect(emitted).toEqual([
      { username: 'john', email: 'john.doe@example.com', password: validPassword },
    ]);
  });

  it('should not emit when the form is invalid', async () => {
    const emitted: ProfileFormData[] = [];
    component.submitted.subscribe((value) => emitted.push(value));
    await setModel('', '', '');
    component.onSubmit(new Event('submit'));
    await fixture.whenStable();
    expect(emitted).toEqual([]);
  });

  it('should render the global error when set', () => {
    fixture.componentRef.setInput('globalError', 'Échec de la sauvegarde.');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Échec de la sauvegarde.');
  });

  it('should render nothing when there is no global error', () => {
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[data-testid="content-error"]'),
    ).toBeNull();
  });

  describe('with an optional password (profile editing)', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('passwordRequired', false);
      await fixture.whenStable();
    });

    it('should be valid with a well-formed username and email and no password', async () => {
      await setModel('john', 'john.doe@example.com', '');
      expect(component.profileForm().valid()).toBe(true);
    });

    it('should not report the password as required when left empty', async () => {
      await setModel('john', 'john.doe@example.com', '');
      expect(messages(component.profileForm.password().errors())).not.toContain(
        'Le mot de passe est obligatoire',
      );
    });

    it('should still enforce the password strength rules once a value is entered', async () => {
      await setModel('john', 'john.doe@example.com', 'weak');
      expect(messages(component.profileForm.password().errors())).toContain(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    });

    it('should be valid with a strong password', async () => {
      await setModel('john', 'john.doe@example.com', validPassword);
      expect(component.profileForm().valid()).toBe(true);
    });
  });
});
