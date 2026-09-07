import { beforeEach, vi } from 'vitest';

/**
 * Le builder `@angular/build:unit-test` exécute Vitest sur jsdom avec une origine
 * opaque (`about:blank`) : ni le Web Storage de jsdom ni le `localStorage`
 * expérimental de Node ne sont utilisables. On fournit une implémentation en
 * mémoire pour que les services qui persistent des données (ex. TokenStore)
 * restent testables sans mock explicite.
 */
class InMemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

vi.stubGlobal('localStorage', new InMemoryStorage());
vi.stubGlobal('sessionStorage', new InMemoryStorage());

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
