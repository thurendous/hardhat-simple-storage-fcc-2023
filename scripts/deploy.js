// imports
const { ethers, run, network } = require("hardhat") // import this so we can track the contracts like SimpleStorage

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying Simple Storage...")
    console.log()
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    // private key?
    // rpc url?
    // the hardhat comes with a default network with them for you
    // so at this point it works as well
    console.log(`Deployed contract to ${simpleStorage.address}`)
    console.log(network.config)

    // automatically verify the contract
    console.log(process.env.ETHERSCAN_API)
    console.log(network.config.chainId)
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API) {
        console.log("Waiting for block confirmations...")
        await simpleStorage.deployTransaction.wait(7)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(8)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("alraedy verified")) {
            console.log("Already Verified! ")
        } else {
            console.log(e)
        }
    }
}

// call main

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
