import { TestBed } from '@angular/core/testing';
import { TokenStore } from './token-store.service';

describe('TokenStore', () => {
  const create = () => {
    TestBed.resetTestingModule();
    return TestBed.inject(TokenStore);
  };

  it('should be created', () => {
    expect(create()).toBeTruthy();
  });

  it('should start with no token when storage is empty', () => {
    expect(create().token()).toBeNull();
  });

  it('should hydrate the token from localStorage on creation', () => {
    localStorage.setItem('token', 'persisted-jwt');

    expect(create().token()).toBe('persisted-jwt');
  });

  it('should expose a read-only signal', () => {
    const store = create();

    expect((store.token as { set?: unknown }).set).toBeUndefined();
  });

  it('should update the signal and persist the token on set', () => {
    const store = create();

    store.set('new-jwt');

    expect(store.token()).toBe('new-jwt');
    expect(localStorage.getItem('token')).toBe('new-jwt');
  });

  it('should clear the signal and storage when set to null', () => {
    const store = create();
    store.set('new-jwt');

    store.set(null);

    expect(store.token()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
