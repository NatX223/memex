import { Chain, PluginBase, createTool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";

import { z } from "zod";
import { Launcher } from "./abi/launcher";
import { TokenDetails } from "./parameters";

const launcherAddress = "";

// Since we are creating a chain-agnostic plugin, we can use the WalletClientBase interface
export class TokenDeployer extends PluginBase<EVMWalletClient> {
    constructor() {
        // We define the name of the plugin
        super("tokenDeployer", []);
    }

    // We define the chain support for the plugin, in this case we support all chains
    supportsChain = (chain: Chain) => true;

    getTools(walletClient: EVMWalletClient) {
        return [
            createTool(
                {
                    name: "token_launcher",
                    description: "launches a token",
                    parameters: TokenDetails,
                },
                async (parameters) => {
                    const originalMessage: string = parameters.message;
                    const prefixedMessage = `BAAAA${originalMessage}`;
                    const signed = await walletClient .signMessage(prefixedMessage);
                    return signed;
                },
            ),
        ];
    }
}

// We export a factory function to create a new instance of the plugin
export const tokenDeployer = () => new TokenDeployer();
