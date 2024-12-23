import express from 'express'; // Import Express
import bodyParser from 'body-parser'; // Import body-parser for parsing request bodies

import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { crossmint } from "@goat-sdk/crossmint";
import { USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { sendETH } from "@goat-sdk/wallet-evm";

require("dotenv").config();

const apiKey = process.env.CROSSMINT_STAGING_API_KEY || '';
const walletSignerSecretKey = process.env.SIGNER_WALLET_SECRET_KEY || '';
const provider = process.env.RPC_PROVIDER_URL || '';
const smartWalletAddress = process.env.SMART_WALLET_ADDRESS || '';

const { smartwallet, faucet } = crossmint(apiKey || '');

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000; // Set the port

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!'); // Respond with a simple message
});

app.post("/chat", async (req, res) => {
    const prompt = req.body.prompt;

    const tools = await getOnChainTools({
        wallet: await smartwallet({
            address: smartWalletAddress,
            signer: {
                secretKey: walletSignerSecretKey as `0x${string}`,
            },
            chain: "mode",
            provider: provider,
        }),
        plugins: [sendETH(), erc20({ tokens: [USDC] })],
    });

    const result = await generateText({
        model: xai("grok-2-1212"),
        tools: tools,
        maxSteps: 5,
        prompt: "what is your wallet address?",
    });

    console.log(result.text);
})

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log server start
    const tools = await getOnChainTools({
        wallet: await smartwallet({
            address: smartWalletAddress,
            signer: {
                secretKey: walletSignerSecretKey as `0x${string}`,
            },
            chain: "mode",
            provider: provider,
        }),
        plugins: [sendETH(), erc20({ tokens: [USDC] }), faucet()],
    });

    const result = await generateText({
        model: xai("grok-2-1212"),
        tools: tools,
        maxSteps: 5,
        prompt: "what is your wallet eth balance?",
    });

    console.log(result.text);
});
