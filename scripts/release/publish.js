const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const { publish, getChangelogEntry } = require('@changesets/release-utils');

module.exports = async ({ github, context, core }) => {
  const { published, publishedPackages } = await publish({
    script: 'yarn release',
  });

  if (!published) {
    console.log(
      'No packages were published, hence no tag/release will be created'
    );
    return;
  }

  for (let i = 0; i < publishedPackages.length; i++) {
    // `name` is what inside package.json is.
    const name = publishedPackages[i].name;

    const version = publishedPackages[i].version;
    const tagName = `${name}@${version}`;

    const workspacesInfo = JSON.parse(
      JSON.parse(execSync('yarn --silent --json workspaces info').toString())
        .data
    );

    const packageInfo = workspacesInfo[name];
    if (packageInfo === undefined) {
      throw new Error(
        'package name that was published is not found in workspace info, abort...'
      );
    }

    let changelogFileName = path.join(packageInfo.location, 'CHANGELOG.md');

    let changelog = await fs.readFile(changelogFileName, 'utf8');

    const changelogEntry = getChangelogEntry(changelog, version);

    if (!changelogEntry) {
      // we can find a changelog but not the entry for this version
      // if this is true, something has probably gone wrong
      throw new Error(`Could not find changelog entry for ${name}@${version}`);
    }

    await github.rest.repos.createRelease({
      owner: context.repo.owner,
      repo: context.repo.repo,
      // `contracts or sdk or artifacts or configs`
      name: `${process.env.REF_NAME.split('-')[1]} - ${version}`,
      tag_name: tagName,
      target_commitish: github.ref_name,
      body: changelogEntry.content,
      prerelease: version.includes('-'),
    });
  }
};
