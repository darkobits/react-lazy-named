import { vite } from '@darkobits/ts';


export default vite.library({
  test: {
    environment: 'jsdom',
    coverage: {
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100
    }
  }
});
