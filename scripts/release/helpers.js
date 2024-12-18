const spawn = require("spawndamnit")

async function runSpawn(command, args) {
    // log the output of the command in terminal
    const spawnOptions = { stdio: 'inherit' }
    console.log("spawn commands and args:", command, args)
    let result = await spawn(command, args, spawnOptions)
    if (result.code !== 0) {
        throw new Error(`${args.join(' ')} failed`)
    }
}


module.exports = {
    organization: '@aragon',
    folderNameToPackageName: {
        'contracts': 'osx-commons-contracts',
        'configs': 'osx-commons-configs',
        'sdk': 'osx-commons-sdk'
    },
    runSpawn
}

