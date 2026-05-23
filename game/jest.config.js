const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^server/(.*)$': '<rootDir>/src/server/$1',
    '^@prisma/client$': '<rootDir>/node_modules/@prisma/client',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true,
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@prisma|@clerk|superjson|@trpc)/)',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__mocks__/**',
    '!src/**/__tests__/**',
    '!src/env.mjs',
    '!src/pages/api/**',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
    '!src/server/**',
    '!src/middleware.ts',
  ],
  coverageThreshold: {
    './src/pages/construct.tsx': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/pages/energy.tsx': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/pages/index.tsx': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/pages/mail.tsx': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/pages/military.tsx': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/pages/production.tsx': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/pages/resources.tsx': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/pages/spying.tsx': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/components/ui/tables/FleetTable.tsx': { branches: 90, functions: 90, lines: 90, statements: 90 },
  },
};

module.exports = createJestConfig(customJestConfig);
