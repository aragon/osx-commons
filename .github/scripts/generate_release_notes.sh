#!/bin/bash

PACKAGE=$1

echo "RELEASE_NOTES<<EOF" >> $GITHUB_ENV
echo "## All changes in $PACKAGE" >> $GITHUB_ENV
echo "" >> $GITHUB_ENV

PULL_REQUESTS=$(gh pr list --label $PACKAGE --state merged --json title,mergeCommit,number)

# convert to base64 so we only have one line per pull request that we iterate over
echo $PULL_REQUESTS | jq -r '.[] | @base64' | while read pull_request ; do
    COMMIT=$(echo $pull_request | base64 -d | jq -r '.mergeCommit.oid')
    NUMBER=$(echo $pull_request | base64 -d | jq -r '.number')
    TITLE=$(echo $pull_request | base64 -d | jq -r '.title')

    # if there is more than 1 tag, the pull request is already included in another release
    if [ $(git tag --contain $COMMIT | grep -i $PACKAGE | wc -l) -le 1 ]; then
        echo "- $TITLE in #$NUMBER" >> $GITHUB_ENV
    fi
done


echo "EOF" >> $GITHUB_ENV
