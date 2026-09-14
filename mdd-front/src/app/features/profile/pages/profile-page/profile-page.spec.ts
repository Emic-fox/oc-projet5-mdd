import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ProfilePage } from './profile-page';
import { Topic } from '@/app/features/topics/models/topic.interface';
import { environment } from '@/environments/environment';

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

  const setupTestBed = async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
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
      component.onProfileUpdate({ username: 'JaneDoe', email: 'john@doe.dev', password: '' });

      const updateReq = httpMock.expectOne(meUrl);
      expect(updateReq.request.method).toBe('PUT');
      expect(updateReq.request.body).toEqual({ username: 'JaneDoe', email: 'john@doe.dev' });
      updateReq.flush({ user: { ...me, username: 'JaneDoe' }, token: 'new-jwt' });

      httpMock.expectNone(passwordUrl);
    });

    it('should update the password when one is provided', () => {
      component.onProfileUpdate({ username: 'JohnDoe', email: 'john@doe.dev', password: 'NewPassword1!' });

      const passwordReq = httpMock.expectOne(passwordUrl);
      expect(passwordReq.request.method).toBe('PUT');
      expect(passwordReq.request.body).toEqual({ newPassword: 'NewPassword1!' });
      passwordReq.flush({});

      httpMock.expectNone(meUrl);
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
  });
});
