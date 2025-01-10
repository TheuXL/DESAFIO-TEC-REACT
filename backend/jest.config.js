module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js', '**/*.spec.js'],
    verbose: true,
    clearMocks: true,
    forceExit: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    maxWorkers: '50%',
    timers: 'fake',
    // moduleDirectories: ['node_modules', 'backend'],
};
