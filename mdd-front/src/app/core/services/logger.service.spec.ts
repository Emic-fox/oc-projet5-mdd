import { vi } from 'vitest';
import { Logger } from './logger.service';

describe('Logger', () => {
  it('logs to console.error in dev mode', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logger = new Logger();

    logger.error('boom', new Error('cause'));

    expect(consoleSpy).toHaveBeenCalledWith('[MDD] boom', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
