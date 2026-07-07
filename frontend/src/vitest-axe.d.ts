import 'vitest';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface Assertion<T = any> extends jest.Matchers<void> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
