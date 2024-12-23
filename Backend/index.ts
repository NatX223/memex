import express from 'express'; // Import Express
import bodyParser from 'body-parser'; // Import body-parser for parsing request bodies
const cors = require("cors");

import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { crossmint } from "@goat-sdk/crossmint";
import { USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { sendETH } from "@goat-sdk/wallet-evm";
import { tokenLauncher } from '@goat-sdk/plugin-token-launcher';
import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mode } from "viem/chains";
import { viem } from "@goat-sdk/wallet-viem";

require("dotenv").config();

const apiKey = process.env.CROSSMINT_STAGING_API_KEY || '';
const walletSignerSecretKey = process.env.SIGNER_WALLET_SECRET_KEY || '';
const provider = process.env.RPC_PROVIDER_URL || '';
const smartWalletAddress = process.env.SMART_WALLET_ADDRESS || '';

const { smartwallet } = crossmint(apiKey || '');

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3300; // Set the port

// Enable CORS
app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests from this origin
        methods: ["GET", "POST"], // Allowed methods
        credentials: true, // Allow credentials if necessary
    })
);

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: mode,
});

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!'); // Respond with a simple message
});

app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const tools = await getOnChainTools({
            // wallet: await smartwallet({
            //     address: smartWalletAddress,
            //     signer: {
            //         secretKey: walletSignerSecretKey as `0x${string}`,
            //     },
            //     chain: "mode",
            //     provider: provider,
            // }),
            wallet: viem(walletClient),
            plugins: [sendETH(), erc20({ tokens: [USDC] }), tokenLauncher()],
        });

        const result = await generateText({
            model: xai("grok-2-1212"),
            tools: tools,
            maxSteps: 5,
            prompt: prompt,
        });

        // Return the result to the client
        res.json({ text: result.text });
        console.log(result.text);
    } catch (error) {
        console.error("Error generating text:", error);

        // Return an error response
        res.status(500).json({ error: "Failed to process request. Please try again later." });
    }
});

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log server start
});