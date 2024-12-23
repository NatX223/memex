# MemeX
token Creator AI assistant

live link - 

> ## Table of Contents

-   [Problem Statement](#Problem-statement)
-   [Solution](#Solution)
-   [How it works](#How-it-works)
-   [Technologies Used](#technologies-used)
    -   [Smart Contract](#Solidity-smart-contracts)
    -   [Klaster](#Klater)
    -   [Next.js](#Next.js)
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

> ## How-it-works

    -   **Index Creation** An Index is created by filling out the details of the index such as the name, description, category 
    and assets that will make up the index. The creation process starts with the factory contract as it deploys the index contract 
    on all supported chains, this is powered by wormhole messaging.
    -   **Calculations** 
        - Price Calculations - The price for each is index is calculated just as in tradFi i.e
                total value of underlying assets
        price = --------------------------------
                 total supply of tokens(shares)
        search how to include calculations and Symbols
        add total value of underlying assets calculation
        - Asset Sell Amount - To get the amount of an underlying asset to be sold off when a user sells of their index tokens, the
        below formula is used
                            amount of index tokens * amount of asset tokens held by index smart contract
        token sell amount = ----------------------------------------------------------------------------
                                                    Total supply of index tokens
    -   **Investing** To invest in an index i.e to buy the index tokens, a user just needs to specify the amount of USDT they want 
    to use in the purchase in the index page and sign the transaction that pops up. When the transaction is signed, the specified 
    amount of USDT is sent to the index contract, which is then used to buy the corresponding amount the constituent assets. Index 
    tokens are then minted to the investor.
    -   **Selling** To sell off index tokens a user enters the index page and specifies the amount of tokens they want to sell off.
    On the smart contracts the corresponding amount of each constituent asset is sold off in exchange for USDT and the proceeds is 
    sent to the investor's specified address and the amount of tokens specified is burned from the investor's address.
    -   **Asset Replacement** In the event that an asset in an index does not perform well or for what ever reason an index creator 
    can choose to replace an asset in the index, the asset being replaced and the asset replacing it will be specified. When an asset
    is been replaced the tokens of the replaced asset in the index smart contract are sold off and the proceeds from that sale are then
    used to purchase the new asset add to the index.

> ## Technologies Used

| <b><u>Stack</u></b>      | <b><u>UsageSummary</u></b>                           |
| :----------------------- | :--------------------------------------------------- |
| **`Solidity`**           | Smart contract                                       |
| **`Klaster`**            | Chain abstraction                                    |
| **`React.js & Next.js`** | Frontend                                             |

-   ### **Solidity smart contracts**

    The  smart contracts can be found [here](https://github.com/NatX223/XanFi-Contracts/tree/main/contracts/Protocol)

    -   **Index Factory Contract** The Index Factory contract as the name suggests, is used in deploying and initializing index fund contracts. 
    This contract is a protocol contract and as such it is deployed and managed by the protocol. The factory contract is deployed on the supported chains. 
    The IndexFactory contract code can be found [here](https://github.com/NatX223/XanFi-Contracts/blob/main/contracts/Protocol/IndexFactory.sol).

    -   **Index Fund Contract** The Index Contract is the main contract of the protocol. Users can deploy their own index fund contract from the factory 
    contract. When an index fund contract is deployed it is also initialized with the various needed parameters such as the asset contracts and the their 
    ratios. This contract handles investing in a fund(buying shares) and selling off shares. Investing in the fund is enabled by the investFund function
    wihich takes in the amount in USDT(the purchase token) the user wants to invest in the fund, This function calculate the amount to be used in purchasing
    the various index assets and calls a DEX swap function to purchase these assets. The corresponding amount of index fund tokens are then minted to the
    caller of the function. The redeem function handles the selling off of the index fund shares tokens, it calculates the amount of the assets tokens it 
    needs to sell off and calls DEX swap function to sell the assets and sends the USDT gotten from the swap to the caller of the function and then the 
    amount of index fund shares tokens are burned from the callers balance. Other functions in this contract include the replaceAsset function that replaces 
    an asset in the index with another - it does this by selling off all tokens of the replaced asset and buying tokens of the new asset with the USDC 
    gotten from the sell off of the replaced asset. 
    The code for the index contract can be found [here](https://github.com/NatX223/XanFi-Contracts/blob/main/contracts/Protocol/IndexFund.sol).

-   ### **Klater**

    - Klater was a core technology used in the project that enabled the chain abstraction features of the dapp. Klaster was used for executing tranasactions 
    and imporving user experience by enabling gas abstraction in the dapp. 
    Highlighted below are the various ways Klaster was used in the development of the dapp.
    - Executing Functions: Klaster was used in executing the various on-chain functions in the app. Examples of the functions that are executed in the 
    dapp include, createIndex, investFund, Redeem and replaceToken functions. The code showing the use of Klaster in the create function is highlighted 
    below:
    ```
    const klaster = await initKlaster({
        accountInitData: loadBicoV2Account({
        owner: signer.address,
        }),
        nodeUrl: klasterNodeHost.default,
    });

    const createOp = rawTx({
        gasLimit: 3000000n,
        to: factoryAddress,
        data: encodeFunctionData({
        abi: factoryAbi,
        functionName: "createIndex",
        args: [name, symbol, assetAddresses, ratioArray]
        })
    });

    const feeChain = await getFeeChain(signer.address);

    const createTx = buildItx({
        steps: [singleTx(chain.id, createOp)],
        feeTx: klaster.encodePaymentFee(feeChain, "USDC")
    });

    const quote = await klaster.getQuote(createTx);
    const arrayifiedHash = ethers.getBytes(quote.itxHash);
    console.log(arrayifiedHash, quote.itxHash);
    const signed = await signer.signMessage(arrayifiedHash);

    const _result = await klaster.execute(quote, signed);
    console.log(_result.itxHash);
    ```
    The complete use of Klaster in executing functions can be found [here](https://github.com/NatX223/XanFi-Client/blob/Klaster/utils/app.js). 
    - Displaying Unified Balance: The unified balance feature from the Klaster SDK was used in fetching and displaying the unified USDC balance of the user, 
    this enables the user to see the specific amount of USDC they can use in investing in a specific token fund. The sample code is given below
    Getting unified balnace
    ```
    export const getUnifiedBalance = async(address) => {
        const klaster = await initKlaster({
        accountInitData: loadBicoV2Account({
            owner: address,
        }),
        nodeUrl: klasterNodeHost.default,
        });

        const uBalance = await mcClient.getUnifiedErc20Balance({
        tokenMapping: mUSDC,
        account: klaster.account,
        });

        return uBalance;
    }
    ```
    Displaying unified balance:
    ```
        <div className="index-page-card lg:card-side border-[2px] border-[#ff00b8] ml-12 mr-12 rounded-2xl bg-gradient-2-0">
            <div className="card-body px-12 py-8">
                <div className="relative grid grid-rows-2 gap-2">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-semibold">Unified Balance</h1>
                        <span>${uBal}</span>
                    </div>
                </div>
            </div>
        </div>
    ```
    - Gas abstraction: Klaster is also used for gas abstraction in the dapp. When creating a token fund the user can 
    choose which token will be used to pay 
    for gas as ilustrated in the image below.

    ![Gas fee selection](public/gas_fee.png)

    To simplify User Experience when executing other transactions USDC is chosen as the default token for fees, however to deduce the specific chain the USDC 
    is gotten from, the unified balance breakdown of the supported chains is analyzed to see on which chain the user has more USDC and then the USDC from 
    that chain is used to cover for the fees. The sample code for that is given below:
    ```
    export const getFeeChain = async(address) => {
    const klaster = await initKlaster({
        accountInitData: loadBicoV2Account({
        owner: address,
        }),
        nodeUrl: klasterNodeHost.default,
    });

    const uBalance = await mcClient.getUnifiedErc20Balance({
        tokenMapping: mUSDC,
        account: klaster.account,
    });

    const sepoliaBreakdown = uBalance.breakdown.find(b => b.chainId === sepolia.id);
    const sepoliaBalance = sepoliaBreakdown.balance;
    const arbitrumBreakdown = uBalance.breakdown.find(b => b.chainId === arbitrumSepolia.id);
    const arbitrumBalance = arbitrumBreakdown.balance;
    if(sepoliaBalance > arbitrumBalance) {
        return sepolia.id;
    } else {
        return arbitrumSepolia.id
    }
    }
    ```
    
- ### **Next.js**

    Next.js was used for the frontend, images of the frontend are given below:
    Home Page
    ![Home page](public/homepage.png)
    Indecies Page
    ![List of indecies](public/indecies.png)
    Index Creation
    ![Index details](public/index_details.png)
    ![Index category](public/index_category.png)
    ![Index deployment](public/gas_fee.png)
    ![Index tokens](public/index_tokens.png)

    How to run

    clone this repository
    ```bash
    git clone https://github.com/NatX223/XanFi
    ```

    enter the XanFi-client directory
    ```bash
    cd XanFi-Client

    install neccesary packages
    ```bash
    npm install --force
    ```

    start development server
    ```bash
    npm run dev
    ```

    view in the browser
    http://localhost:3000

> ## Deployment

    The deployment and transactions details are given below:

-   ### **Deployment Addresses**

| <b><u>Contract</u></b>   | <b><u>Sepolia</u></b>                                | <b><u>Arbitrum Sepolia</u></b>                       |
| :----------------------- | :--------------------------------------------------- | :--------------------------------------------------- |
| **`Factory`**            | 0x616a2e583497E092183F3D97764F3F697062A29E           | 0x9E5C50d901978e5bA1E2e8235881051ca7aEB802           |

-   ### **Transactions**

| <b><u>Contract</u></b>   | <b><u>ITX hash</u></b>                                                |
| :----------------------- | :-------------------------------------------------------------------- |
| **`createIndex`**        |  0xc5ca3caf4bf50177dad3e5dd7f94f1d6481d67b924dbae517c3c79592e33a4f8   |
| **`investFund`**         |  0x04b0456b199957ea069b97e176263e48f4eef8ba41f97b0194637162508eb6f7   |