/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@smart-stadiums/(.*)$': '<rootDir>/../$1/src'
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
