import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterForm } from './register-form';

describe('RegisterForm', () => {
  let component: RegisterForm;
  let fixture: ComponentFixture<RegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const setModel = async (username: string, email: string, password: string) => {
    component.registerModel.set({ username, email, password });
    await fixture.whenStable();
  };

  const messages = (errors: readonly { message?: string }[]) =>
    errors.map((e) => e.message);

  const validPassword = 'Abcdef1!';

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty model', () => {
    expect(component.registerModel()).toEqual({ username: '', email: '', password: '' });
  });

  it('should be invalid when empty', () => {
    expect(component.registerForm().invalid()).toBe(true);
  });

  it('should require the username', async () => {
    await setModel('', 'john.doe@example.com', validPassword);
    expect(messages(component.registerForm.username().errors())).toContain(
      "Le nom d'utilisateur est obligatoire",
    );
  });

  it('should require the email', async () => {
    await setModel('john', '', validPassword);
    expect(messages(component.registerForm.email().errors())).toContain(
      "L'adresse e-mail est obligatoire",
    );
  });

  it('should reject a malformed email', async () => {
    await setModel('john', 'not-an-email', validPassword);
    expect(messages(component.registerForm.email().errors())).toContain(
      "L'adresse e-mail doit être valide",
    );
  });

  it('should require the password', async () => {
    await setModel('john', 'john.doe@example.com', '');
    expect(messages(component.registerForm.password().errors())).toContain(
      "Le mot de passe est obligatoire",
    );
  });

  it('should reject a password shorter than 8 characters', async () => {
    await setModel('john', 'john.doe@example.com', 'Ab1!');
    expect(messages(component.registerForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 8 caractères',
    );
  });

  it('should require a digit in the password', async () => {
    await setModel('john', 'john.doe@example.com', 'Abcdefg!');
    expect(messages(component.registerForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 1 chiffre',
    );
  });

  it('should require a lowercase letter in the password', async () => {
    await setModel('john', 'john.doe@example.com', 'ABCDEF1!');
    expect(messages(component.registerForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 1 minuscule',
    );
  });

  it('should require an uppercase letter in the password', async () => {
    await setModel('john', 'john.doe@example.com', 'abcdef1!');
    expect(messages(component.registerForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 1 majuscule',
    );
  });

  it('should require a special character in the password', async () => {
    await setModel('john', 'john.doe@example.com', 'Abcdef12');
    expect(messages(component.registerForm.password().errors())).toContain(
      'Le mot de passe doit contenir au moins 1 caractère spécial',
    );
  });

  it('should be valid with a well-formed username, email and password', async () => {
    await setModel('john', 'john.doe@example.com', validPassword);
    expect(component.registerForm().valid()).toBe(true);
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

  it('should submit the current credentials', async () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {}); // TODO remplacer par le service
    await setModel('john', 'john.doe@example.com', validPassword);
    component.onSubmit(new Event('submit'));
    await fixture.whenStable();
    expect(debug).toHaveBeenCalledWith('Registering with:', {
      username: 'john',
      email: 'john.doe@example.com',
      password: validPassword,
    });
    debug.mockRestore();
  });
});
