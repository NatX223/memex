import { Chain, PluginBase, WalletClientBase, createTool } from "@goat-sdk/core";

// Since we are creating a chain-agnostic plugin, we can use the WalletClientBase interface
export class TokenDeployer extends PluginBase<WalletClientBase> {
    constructor() {
        // We define the name of the plugin
        super("tokenDeployer", []);
    }

    // We define the chain support for the plugin, in this case we support all chains
    supportsChain = (chain: Chain) => true;

    getTools(walletClient: WalletClientBase) {
        return [
            // Create tool requires two arguments:
            // 1. The tool metadata (name, description, parameters)
            // 2. The tool method (the function that will be executed when the tool is used)
            createTool(
                {
                    name: "sign_message_baaaa",
                    description: "Sign a message with 'BAAAA' prefix",
                    parameters: z.object({
                        message: z.string(),
                    }),
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
