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
    '^.+\\.(ts|tsx|js|jsx|mjs)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true,
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@prisma|@clerk|superjson|@trpc)/)',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mjs'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
};

module.exports = createJestConfig(customJestConfig);
