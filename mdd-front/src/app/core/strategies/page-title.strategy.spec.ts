import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';
import { vi } from 'vitest';

import { PageTitleStrategy } from './page-title.strategy';

describe('PageTitleStrategy', () => {
  let strategy: PageTitleStrategy;
  let title: Title;
  let setTitle: ReturnType<typeof vi.spyOn>;

  const snapshot = {} as RouterStateSnapshot;

  const stubBuildTitle = (value: string | undefined) =>
    vi.spyOn(strategy as unknown as { buildTitle: () => string | undefined }, 'buildTitle')
      .mockReturnValue(value);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageTitleStrategy],
    });

    strategy = TestBed.inject(PageTitleStrategy);
    title = TestBed.inject(Title);
    setTitle = vi.spyOn(title, 'setTitle').mockImplementation(() => {});
  });

  it('should create', () => {
    expect(strategy).toBeTruthy();
  });

  it('should append the " | MDD" suffix to the route title', () => {
    const buildTitle = stubBuildTitle('Connexion');

    strategy.updateTitle(snapshot);

    expect(buildTitle).toHaveBeenCalledWith(snapshot);
    expect(setTitle).toHaveBeenCalledWith('Connexion | MDD');
  });

  it('should fall back to "Monde de Dév | MDD" when the route has no title', () => {
    stubBuildTitle(undefined);

    strategy.updateTitle(snapshot);

    expect(setTitle).toHaveBeenCalledWith('Monde de Dév | MDD');
  });

  it('should also fall back when the route title is an empty string', () => {
    stubBuildTitle('');

    strategy.updateTitle(snapshot);

    expect(setTitle).toHaveBeenCalledWith('Monde de Dév | MDD');
  });
});
