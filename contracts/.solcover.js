module.exports = {
  istanbulReporter: ['html', 'lcov', 'text'],
  providerOptions: {
    privateKey: process.env.PRIVATE_KEY,
  },
  skipFiles: ['mocks'],
};
