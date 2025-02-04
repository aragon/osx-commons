const path = require('path');
const fs = require('fs');

const {version, repository} = require('../package.json');

const helpers = require(path.resolve(__dirname, './templates/helpers'));

// overwrite the functions.

// Tags on `osx-commons-contracts` repo are created as below.
helpers.version = () => `${version}-contracts/contracts`;

helpers.githubURI = () => repository.url;

module.exports = {
  outputDir: 'docs/modules/api/pages',
  templates: 'docs/templates',
  exclude: ['mocks', 'test'],
  pageExtension: '.adoc',
  collapseNewlines: true,
  pages: (_, file, config) => {
    return 'osx-commons' + config.pageExtension;
  },
};
