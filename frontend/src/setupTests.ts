import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';
import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  export interface Assertion<T = any> {
    toHaveNoViolations(): Promise<void>;
  }
}
