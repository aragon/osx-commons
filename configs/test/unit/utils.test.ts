import { SupportedAliases, SupportedNetworks } from "../../src/types";
import { getNetworkAlias, getNetworkNameFromAlias } from "../../src/utils";

describe("utils", () => {
    describe("getNetworkAlias",() => {
        it("should return the network alias", () => {
            const inputs = [
                {
                    input: SupportedNetworks.MAINNET,
                    alias: SupportedAliases.ETHERS5,
                    expectedOutput: 'homestead'
                },
                {
                    input: SupportedNetworks.MAINNET,
                    alias: SupportedAliases.ALCHEMY_SUBGRAPHS,
                    expectedOutput: 'mainnet'
                },
                {
                    input: SupportedNetworks.POLYGON,
                    alias: SupportedAliases.ETHERS5,
                    expectedOutput: 'matic'
                },
                {
                    input: SupportedNetworks.MUMBAI,
                    alias: SupportedAliases.ETHERS5,
                    expectedOutput: 'maticmum'
                },
                {
                    input: SupportedNetworks.MUMBAI,
                    alias: SupportedAliases.ETHERS6,
                    expectedOutput: 'matic-mumbai'
                },
                {
                    input: SupportedNetworks.MUMBAI,
                    alias: SupportedAliases.ALCHEMY_SUBGRAPHS,
                    expectedOutput: 'mumbai'
                },
            ]
            for (const input of inputs) {
                expect(getNetworkAlias(input.input, input.alias)).toEqual(input.expectedOutput);
            }
        });
    })
    describe("getNetworkNameFromAlias",() => {
        it("should return the network name from alias", () => {
            const inputs = [
                {
                    input: 'homestead',
                    alias: SupportedAliases.ETHERS5,
                    expectedOutput: SupportedNetworks.MAINNET
                },
                {
                    input: 'mainnet',
                    alias: SupportedAliases.ALCHEMY_SUBGRAPHS,
                    expectedOutput: SupportedNetworks.MAINNET,
                },
                {
                    input: 'matic',
                    alias: SupportedAliases.ETHERS5,
                    expectedOutput: SupportedNetworks.POLYGON,
                },
                {
                    input: 'maticmum',
                    alias: SupportedAliases.ETHERS5,
                    expectedOutput: SupportedNetworks.MUMBAI,
                },
                {
                    input: 'matic-mumbai',
                    alias: SupportedAliases.ETHERS6,
                    expectedOutput: SupportedNetworks.MUMBAI,
                },
                {
                    input: 'mumbai',
                    alias: SupportedAliases.ALCHEMY_SUBGRAPHS,
                    expectedOutput: SupportedNetworks.MUMBAI,
                },
            ]
            for (const input of inputs) {
                expect(getNetworkNameFromAlias(input.input, input.alias)).toEqual(input.expectedOutput);
            }
            // TODO
        });
    })
});