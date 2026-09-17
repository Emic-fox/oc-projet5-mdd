import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ProfilePage } from './profile-page';
import { Topic } from '@/app/features/topics/models/topic.interface';
import { environment } from '@/environments/environment';
import { Notifier } from '@app/core/services/notifier.service';
import { apiErrorInterceptor } from '@app/core/errors/api-error.interceptor';

const topicsUrl = `${environment.apiUrl}/api/topics?subscribed=true`;
const meUrl = `${environment.apiUrl}/api/auth/me`;
const passwordUrl = `${environment.apiUrl}/api/auth/me/password`;

describe('ProfilePage', () => {
  const topics: Topic[] = [
    { id: 1, name: 'Thème 1', description: 'Description 1', subscribed: true },
  ];
  const me = { id: 1, username: 'JohnDoe', email: 'john@doe.dev' };

  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let httpMock: HttpTestingController;
  let notifier: Notifier;

  const setupTestBed = async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    notifier = TestBed.inject(Notifier);
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', async () => {
    await setupTestBed();
    await fixture.whenStable();
    httpMock.expectOne(topicsUrl).flush(topics);

    expect(component).toBeTruthy();
  });

  it('should display an error when loading the subscriptions fails', async () => {
    await setupTestBed();
    await fixture.whenStable();
    httpMock.expectOne(topicsUrl).flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue. Veuillez réessayer.');
  });

  it('should display both the form error and the subscriptions error at once when both fail', async () => {
    // Deux instances du même composant (`app-errors-container`, testid "content-error") coexistent
    // sur cette page : l'une dans `app-profile-form`, l'autre pour la liste d'abonnements. Elles se
    // distinguent par leur conteneur, pas par le testid (partagé volontairement).
    localStorage.setItem('token', 'jwt');
    await setupTestBed();
    httpMock.expectOne(meUrl).flush(me);
    await fixture.whenStable();
    httpMock.expectOne(topicsUrl).flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    component.onProfileUpdate({ username: 'JaneDoe', email: 'john@doe.dev', password: '' });
    httpMock.expectOne(meUrl).flush('Conflict', { status: 409, statusText: 'Conflict' });
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('[data-testid="content-error"]');
    expect(errors).toHaveLength(2);
    expect(errors[0].textContent).toContain('Une erreur est survenue. Veuillez réessayer.');
    expect(errors[1].textContent).toContain('Une erreur est survenue. Veuillez réessayer.');
  });

  it('should remove the topic from the list when unsubscribing', async () => {
    await setupTestBed();
    await fixture.whenStable();
    httpMock.expectOne(topicsUrl).flush(topics);

    component.onUnsubscribe(1);

    expect(component.topics()).toEqual([]);
  });

  describe('onProfileUpdate', () => {
    beforeEach(async () => {
      // Crée le composant avec un utilisateur déjà chargé
      localStorage.setItem('token', 'jwt');
      await setupTestBed();

      httpMock.expectOne(meUrl).flush(me);
      await fixture.whenStable();
      httpMock.expectOne(topicsUrl).flush(topics);
    });

    it('should not call the API when nothing changed and no password is provided', () => {
      component.onProfileUpdate({ username: 'JohnDoe', email: 'john@doe.dev', password: '' });

      httpMock.expectNone(meUrl);
      httpMock.expectNone(passwordUrl);
    });

    it('should update the profile when the username or the email changed', () => {
      const notifierSpy = vi.spyOn(notifier, 'success');
      component.onProfileUpdate({ username: 'JaneDoe', email: 'john@doe.dev', password: '' });

      const updateReq = httpMock.expectOne(meUrl);
      expect(updateReq.request.method).toBe('PUT');
      expect(updateReq.request.body).toEqual({ username: 'JaneDoe', email: 'john@doe.dev' });
      updateReq.flush({ user: { ...me, username: 'JaneDoe' }, token: 'new-jwt' });

      httpMock.expectNone(passwordUrl);
      expect(notifierSpy).toHaveBeenCalledWith('Profil mis à jour.');
    });

    it('should update the password when one is provided', () => {
      const notifierSpy = vi.spyOn(notifier, 'success');
      component.onProfileUpdate({ username: 'JohnDoe', email: 'john@doe.dev', password: 'NewPassword1!' });

      const passwordReq = httpMock.expectOne(passwordUrl);
      expect(passwordReq.request.method).toBe('PUT');
      expect(passwordReq.request.body).toEqual({ newPassword: 'NewPassword1!' });
      passwordReq.flush({});

      httpMock.expectNone(meUrl);
      expect(notifierSpy).toHaveBeenCalledWith('Mot de passe mis à jour.');
    });

    it('should update the profile and the password together', () => {
      component.onProfileUpdate({ username: 'JaneDoe', email: 'jane@doe.dev', password: 'NewPassword1!' });

      const updateReq = httpMock.expectOne(meUrl);
      expect(updateReq.request.method).toBe('PUT');
      const passwordReq = httpMock.expectOne(passwordUrl);
      expect(passwordReq.request.method).toBe('PUT');

      updateReq.flush({ user: { id: 1, username: 'JaneDoe', email: 'jane@doe.dev' }, token: 'new-jwt' });
      passwordReq.flush({});
    });

    it('should display an error and skip the toast when the profile update fails', () => {
      const notifierSpy = vi.spyOn(notifier, 'success');
      component.onProfileUpdate({ username: 'JaneDoe', email: 'john@doe.dev', password: '' });

      httpMock.expectOne(meUrl).flush('Conflict', { status: 409, statusText: 'Conflict' });
      fixture.detectChanges();

      expect(notifierSpy).not.toHaveBeenCalled();
      expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue. Veuillez réessayer.');
    });

    it('should display an error and skip the toast when the password update fails', () => {
      const notifierSpy = vi.spyOn(notifier, 'success');
      component.onProfileUpdate({ username: 'JohnDoe', email: 'john@doe.dev', password: 'NewPassword1!' });

      httpMock.expectOne(passwordUrl).flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      fixture.detectChanges();

      expect(notifierSpy).not.toHaveBeenCalled();
      expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue. Veuillez réessayer.');
    });

    it('should clear the previous error on a new submission', () => {
      component.onProfileUpdate({ username: 'JaneDoe', email: 'john@doe.dev', password: '' });
      httpMock.expectOne(meUrl).flush('Conflict', { status: 409, statusText: 'Conflict' });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Une erreur est survenue. Veuillez réessayer.');

      component.onProfileUpdate({ username: 'JohnDoe', email: 'john@doe.dev', password: '' });
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('Une erreur est survenue. Veuillez réessayer.');
      httpMock.expectNone(meUrl);
    });
  });
});
