import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginForm, LoginData } from './login-form';

describe('LoginForm', () => {
  let component: LoginForm;
  let fixture: ComponentFixture<LoginForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const setModel = async (login: string, password: string) => {
    component.loginModel.set({ login, password });
    await fixture.whenStable();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty model', () => {
    expect(component.loginModel()).toEqual({ login: '', password: '' });
  });

  it('should be invalid when both fields are empty', async () => {
    await fixture.whenStable();
    expect(component.loginForm().invalid()).toBe(true);
  });

  it('should require the login field', async () => {
    await setModel('', 'secret');
    expect(component.loginForm.login().invalid()).toBe(true);
    expect(
      component.loginForm.login().errors().map((e) => e.message),
    ).toContain("L'identifiant est obligatoire");
  });

  it('should require the password field', async () => {
    await setModel('JohnDoe', '');
    expect(component.loginForm.password().invalid()).toBe(true);
    expect(
      component.loginForm.password().errors().map((e) => e.message),
    ).toContain('Le mot de passe est obligatoire');
  });

  it('should be valid when both fields are filled', async () => {
    await setModel('JohnDoe', 'secret');
    expect(component.loginForm().valid()).toBe(true);
  });

  it('should disable the submit button while invalid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should enable the submit button once valid', async () => {
    await setModel('JohnDoe', 'secret');
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

  it('should emit the current credentials on submit', async () => {
    const emitted: LoginData[] = [];
    component.submitted.subscribe((value) => emitted.push(value));
    await setModel('JohnDoe', 'secret');
    component.onSubmit(new Event('submit'));
    await fixture.whenStable();
    expect(emitted).toEqual([{ login: 'JohnDoe', password: 'secret' }]);
  });

  it('should not emit when the form is invalid', async () => {
    const emitted: LoginData[] = [];
    component.submitted.subscribe((value) => emitted.push(value));
    await setModel('', '');
    component.onSubmit(new Event('submit'));
    await fixture.whenStable();
    expect(emitted).toEqual([]);
  });
});
