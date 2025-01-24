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

# Read repositories from JSON file
REPOS=$(cat $current_dir/repos.json | jq -c '.repositories[]')


#  create index.ts files
echo "export * from './abis';" > $current_dir/src/index.ts
echo "" > $current_dir/src/abis/index.ts 

# Process each line
while IFS= read -r repo; do
    # Skip empty lines
    [ -z "$repo" ] && continue

    # Extract values using jq
    repoUrl=$(echo "$repo" | jq -r '.url')
    branch=$(echo "$repo" | jq -r '.branch')
    projectType=$(echo "$repo" | jq -r '.projectType')
    contractsDirectory=$(echo "$repo" | jq -r '.contractsDir')
    artifactSource=$(echo "$repo" | jq -r '.artifactsDir')
    repoName=$(echo "$repo" | jq -r '.name')  
    contractFilesToInclude=$(echo "$repo" | jq -r '.contractFilesToInclude')

    git clone -b ${branch} $repoUrl $repoName
    cd $repoName/$contractsDirectory
    
    yarn install
    # link needed packages => remove once the package don't need linking 
    yarn link @aragon/osx-commons-contracts

    if [ "$projectType" = "foundry" ]; then 
        #  link on spp
        yarn link @aragon/osx
    fi

    yarn add -D @wagmi/cli

    if [ "$projectType" = "hardhat" ]; then
        cp $current_dir/wagmi.hardhat.config.ts wagmi.config.ts
        sed -i -e "s|REPLACE_ARTIFACTS_SOURCE|${artifactSource}|g" wagmi.config.ts
        npx hardhat compile
        
    elif [ "$projectType" = "foundry" ]; then
        cp $current_dir/wagmi.foundry.config.ts wagmi.config.ts
        export CONTRACTS_TO_INCLUDE="${contractFilesToInclude}"
        forge remappings
        forge compile

    else 
        echo "either hardhat or foundry project is required"
        exit 1
    fi 

    yarn wagmi generate

     # Create the destination directory if it doesn't exist
    mkdir -p "$current_dir/src/abis/${repoName}"
    
    # Check if the source file exists before moving
    if [ -f "generated/abis.ts" ]; then
        mv generated/abis.ts "$current_dir/src/abis/${repoName}/abis.ts"
    else
        echo "Warning: generated/abis.ts not found for ${repoName}"
    fi

    #  add the repo to the index.ts file    
    echo "export * from './${repoName}/abis';" >> $current_dir/src/abis/index.ts

    cd $current_dir/$CLONE_DIR

done <<< "$REPOS"