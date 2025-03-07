module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
    testTimeout: 30000,
};
