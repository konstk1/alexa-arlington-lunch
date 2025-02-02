import type { Config } from 'jest'

// Sync object  
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  // setupFiles: [
  //   'dotenv/config',
  // ],
  setupFilesAfterEnv: [
    '<rootDir>/test/jest.setup.ts',
  ]
}

export default config