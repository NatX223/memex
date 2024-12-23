import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, modeTestnet } from "viem/chains";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { PEPE, USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { tokenLauncher } from "@goat-sdk/plugin-token-launcher";

import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";

require("dotenv").config();

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: modeTestnet,
});

(async () => {
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [sendETH(), erc20({ tokens: [USDC, PEPE] }), tokenLauncher()],
    });

    const result = await generateText({
        model: xai("grok-2-1212"),
        tools: tools,
        maxSteps: 10,
        prompt: "deploy a token with name 'pepemax', use the abbreviation of the name as the symbol",
    });

    console.log(result.text);
})();

// set meta(topic type)
// set duration() (?)
// create meme
// create name
// deploy
// create liq pool
// provide liquidity