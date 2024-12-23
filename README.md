# MemeX
token Creator AI assistant

live link - 

> ## Table of Contents

-   [Problem Statement](#Problem-statement)
-   [Solution](#Solution)
-   [How to run](#How-to-run)
-   [How it works](#How-it-works)
-   [Technologies Used](#technologies-used)
    -   [Smart Contract](#Solidity-smart-contracts)
    -   [Goat-SDK](#Goat-SDK)
    -   [Crossmint](#Crossmint)
    -   [Vercel-ai](#Vercel-ai)
-   [Deployment](#Deployment)
#

> ## Problem-statement

Problem: Many meme tokens are born out of real-world events or popular personalities, which are often discussed in real-time on platforms like 
Twitter. However, it can be challenging for individuals to keep up with these fast-moving trends and seamlessly take advantage of them 
by quickly creating tokens that capitalize on the momentum. The process of identifying emerging trends, developing the associated 
tokens, and deploying them on decentralized exchanges (DEXs) is typically time-consuming and requires significant technical expertise. 
This creates a barrier for users who want to act on trending topics in a timely and efficient manner, limiting their ability to engage 
in the fast-paced world of meme tokens and decentralized finance (DeFi).

> ## Solution

Solution: The solution being built with this MemeX is an AI agent powered by the goat-sdk that streamlines the process of capitalizing 
on trending topics on X (formerly Twitter). The agent automatically identifies emerging trends and creates tokens related to those 
trends. It then goes a step further by deploying liquidity pools on decentralized exchanges (DEXs) and providing liquidity for the 
newly created tokens. Essentially, this AI agent acts as a fully automated token launch platform, enabling users to seamlessly tap 
into real-time social trends without the need for technical expertise or manual intervention, empowering them to quickly capitalize on 
trending events and personalities in the fast-paced world of meme tokens and decentralized finance (DeFi).

> ## How-to-run

    clone this repository
    ```bash
    git clone https://github.com/NatX223/memex
    ```

    enter the Backend directory
    ```bash
    cd Backend
    ```

    add these in the .env file
    ```
    XAI_API_KEY=xai-HhyX6bpI0KhrEEk1mlX3EFavKkFRxAEioEG4WRnOUdS2E6J95GSwW2k5k94PQBYQB7NakO4BuoNxunrm
    WALLET_PRIVATE_KEY=your private key
    RPC_PROVIDER_URL=https://mainnet.mode.network
    CROSSMINT_STAGING_API_KEY=sk_staging_6BFQExFJAmFvFCRpG3jSEDQKec5w7dJN4HvDSyXU7AzjtCVd8jEQnSpqd5LvTpa72LgTDkMovkensk9PC7Zk27HP2eBWTQEBbkqTfbyYW9HNowiadh1G4wm9tpJNSvkpvHhqtDQVuJhTdVRHE2VExPU8b22Bzm7PABsbfGv8R1pdPSogSctnyV5LeCEHdgbx24ADVUizh1WPtwU1D2rjxx87
    SIGNER_WALLET_SECRET_KEY=0x1948be654292edaf4b77904b1b7f26a3d95eaa0abffe81a86384599b36d8f7e9
    SIGNER_WALLET_ADDRESS=0x0CF7D32B9CeF506fF7C6E7A6A88c24024F3aF23c
    SMART_WALLET_ADDRESS=0x9451cD01Ea75AA1627b1eCdd9733B324aCee6826
    PORT=3300
    ```

    install neccesary packages
    ```bash
    npm install
    ```

    include the custom token launcher plugin by unzipping the plugin-token-launcher.zip file and place it in the node_modules/
    @goat-sdk folder

    start development server
    ```bash
    npm run start
    ```

    navigate to the Frontend folder
    ```bash
    cd ..
    cd Frontend
    ```

    start development server
    ```bash
    npm run dev
    ```    

    view in the browser
    http://localhost:3000

    Click on the chat button on the top right corner
    Enter a prompt to deploy a token
    Click on send button
    Prompt for contract address
    View on Explorer
    
> ## How-it-works

1. **Frontend Interface**:  
   - Users enter prompts via the frontend interface, specifying only the token name and symbol.

2. **Backend Processing**:  
   - The prompts are sent to the backend, which uses the **Grok LLM model** to interpret and execute the request.  
   - This backend is powered by **Vercel AI**, **Goat-SDK**, and a **custom plugin**.

3. **ERC-20 Token Deployment**:  
   - The custom plugin calls a factory function to deploy an ERC-20 token smart contract automatically based on the user's inputs.  
   - The AI agent has an embedded wallet, eliminating the need for users to interact directly with blockchain transactions.

4. **Token Details Query**:  
   - Once the token is deployed, users can query the AI agent to retrieve the token's contract address.

This streamlined approach makes creating and managing blockchain tokens accessible and efficient for users.

> ## Technologies Used

| <b><u>Stack</u></b>      | <b><u>UsageSummary</u></b>                           |
| :----------------------- | :--------------------------------------------------- |
| **`Solidity`**           | Smart contract                                       |
| **`Goat-SDK`**           | Goat-SDK                                             |
| **`Crossmint`**          | Crossmint                                            |
| **`vercel-ai`**          | vercel-ai                                            |

-   ### **Solidity smart contracts**

    The  smart contracts and deployment scripts can be found [here](https://github.com/NatX223/memex/tree/main/Smart-Contracts)

    -   **Token Factory Contract** The Token Factory contract as the name suggests is the main contract of the pproject that uses create2 to deploy ERC20 
    tokens. By default an initial supply of one million tokens are minted to the user when the token is deployed.
    The Token Factory contract code can be found [here](https://github.com/NatX223/memex/blob/main/Smart-Contracts/contracts/tokenFactory.sol).

-   ### **GOAT-SDK**

    - GOAT-SDK was a core technology used in the project that enabled the creation of the custom plugin for deploying erc20 tokens, the pluginBase from 
    goat-sdk was utilized for this. The plugin was created in a fork of the goat-sdk repo. which can be found [here]()
    Highlighted below are the ways GOAT-SDK was used in the development of the dapp.
    The code showing the use of GOAT-SDK for creating a plugin is highlighted 
    below:
    ```ts
    import { type Chain, PluginBase } from "@goat-sdk/core";
    import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
    import { mode, modeTestnet } from "viem/chains";
    import { TokenLauncherService } from "./token-launcher.service";

    const SUPPORTED_CHAINS = [mode, modeTestnet];

    export class TokenLauncher extends PluginBase<EVMWalletClient> {
        constructor() {
            super("token-launcher", [new TokenLauncherService()]);
        }

        supportsChain = (chain: Chain) => chain.type === "evm" && SUPPORTED_CHAINS.some((c) => c.id === chain.id);
    }

    export const tokenLauncher = () => new TokenLauncher();
    ```
    The complete use of GOAT-SDK in the token-launcher plugin can be found [here](). 

    The GOAT-SDK was used with the Vercel-AI SDK to call the grok LLM, various plugins from the goat-sdk was imported and used with the Vercel-AI SDK for various functionality.
    Below shows how they were imported and used.
    ```ts
    import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
    import { crossmint } from "@goat-sdk/crossmint";
    import { USDC, erc20 } from "@goat-sdk/plugin-erc20";
    import { sendETH } from "@goat-sdk/wallet-evm";
    import { tokenLauncher } from '@goat-sdk/plugin-token-launcher';
    ``` 

    ```ts
        const tools = await getOnChainTools({
            wallet: viem(walletClient),
            plugins: [sendETH(), erc20({ tokens: [USDC] }), tokenLauncher()],
        });
    ```
    
- ### **Crossmint**

    Crossmint smart wallet is also an option to use for wallets, the createSmartWallet script was used to create a new wallet, the address wallet created is given below
    ```solidity
    0x9451cD01Ea75AA1627b1eCdd9733B324aCee6826
    ```

    The samrt wallet can be utilzed as shown below
    ```ts
            const tools = await getOnChainTools({
                wallet: await smartwallet({
                    address: smartWalletAddress,
                    signer: {
                    secretKey: walletSignerSecretKey as `0x${string}`,
                },
                chain: "mode",
                provider: provider,
            }),
            plugins: [sendETH(), erc20({ tokens: [USDC] }), tokenLauncher()],
        });
    ```

> ## Deployment

    The deployment and transactions details are given below:

-   ### **Deployment Addresses**

| <b><u>Contract</u></b>   | <b><u>Mode</u></b>                             |
| :----------------------- | :----------------------------------------------|
| **`Token Factory`**      | 0xE9B7A8da59c02a6Dcc643AEA3f6fe6E9B57CA127     |

-   ### **Tokens**

| <b><u>Name</u></b>       | <b><u>Address</u></b>                          |
| :----------------------- | :----------------------------------------------|
| **`GOAT-SDK`**           |  0xb4DeBe18216D023960dbBe39120DDeE3ae7DE094    |
| **`mecoin`**             |  0x9aDF9c754FC669C5223fAc153cb48344CE720DF1    |