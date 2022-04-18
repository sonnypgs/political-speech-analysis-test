/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^csv-parse/sync': '<rootDir>/node_modules/csv-parse/dist/cjs/sync.cjs',
  },
};
