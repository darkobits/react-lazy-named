import { vite } from '@darkobits/ts';


export default vite.library({
  test: {
    environment: 'jsdom',
    coverage: {
      lines: 95,
      branches: 85,
      functions: 80,
      statements: 95
    }
  }
});
