import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
     displayName: {
     name: "codecov-pipeline-fail",
     color: "greenBright",
    },
    verbose: true,
    testEnvironment: "node",
    detectOpenHandles: true,
    collectCoverage: true,
    transform: { "^.+\\.tsx?$": "ts-jest" },
    forceExit: true,
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
    roots: ['<rootDir>'],
    moduleNameMapper: {
      '~/src/(.*)': '<rootDir>/src/$1',
    },
    clearMocks: true,

  }
}