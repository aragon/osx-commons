#!/bin/bash

source .env

if [ -z "$ALCHEMY_API_KEY" ] 
then
    echo "ALCHEMY_API_KEY is not set on the .env file, exiting..."
    exit -1
else
    export ALCHEMY_API_KEY=$ALCHEMY_API_KEY
fi


current_dir=$(pwd)
CLONE_DIR="temp_dir"

rm -rf $CLONE_DIR
mkdir -p $CLONE_DIR
cd $CLONE_DIR

# The format is the following:
# repoUrl = branchname&artifactsDirectory&projectType&contractsDirectory

REPOS=$(cat <<EOF
https://github.com/aragon/osx=develop&artifacts/src&hardhat&packages/contracts,
https://github.com/aragon/admin-plugin=develop&artifacts/src&hardhat&packages/contracts,
https://github.com/aragon/token-voting-plugin=develop&artifacts/src&hardhat&packages/contracts,
https://github.com/aragon/multisig-plugin=develop&artifacts/src&hardhat&packages/contracts,
https://github.com/aragon/staged-proposal-processor-plugin=init-project&out&forge&
EOF
)

# Process each line
while IFS=',' read -r line; do
    IFS='=' read -r repoUrl data <<< "$line"

    IFS='&' read -r branch artifactSource projectType contractsDirectory <<< "$data"

    REPO_NAME=$(basename $repoUrl .git)

    git clone -b ${branch} $repoUrl $REPO_NAME
    
    cd $REPO_NAME/$contractsDirectory
    
    yarn install
    
    yarn add -D @wagmi/cli

    if [ "$projectType" = "hardhat" ]; then
        cp $current_dir/wagmi.hardhat.config.ts wagmi.config.ts
        sed -i -e "s|REPLACE_ARTIFACTS_SOURCE|${artifactSource}|g" wagmi.config.ts
        npx hardhat compile
        
    elif [ "$projectType" = "forge" ]; then
        cp $current_dir/wagmi.foundry.config.ts wagmi.config.ts
        forge remappings
        forge compile

    else 
        echo "either hardhat or forge project is required"
        exit 1
    fi 

    yarn wagmi generate
    
    mv generated/abis.ts $current_dir/src/abis/${REPO_NAME}-abis.ts

    cd $current_dir/$CLONE_DIR

done <<< "$REPOS"
