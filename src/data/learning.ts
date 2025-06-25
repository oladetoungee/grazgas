export interface Question {
  question: string;
  answer: string;
}

export interface LearningSection {
  title: string;
  questions: Question[];
}

export const learningSections: LearningSection[] = [
  {
    title: 'Section 1: Basics of Gas',
    questions: [
      {
        question: '1. What is gas in Web3?',
        answer: `In Web3, gas refers to the fee required to perform a transaction or execute a smart contract on blockchain networks like Ethereum. It's the computational cost paid to miners or validators.`
      },
      {
        question: '2. Why is gas needed?',
        answer: `Gas prevents network abuse and ensures miners/validators are compensated for verifying and processing transactions.`
      },
      {
        question: '3. What is gas measured in?',
        answer: `Gas is measured in Gwei, a small denomination of ETH. 1 ETH = 1,000,000,000 Gwei (10⁹ Gwei)`
      },
      {
        question: '4. Who sets the gas fee?',
        answer: `Users propose a fee, but miners/validators choose transactions based on the highest gas price. Networks like Ethereum also suggest base fees.`
      }
    ]
  },
  {
    title: 'Section 2: Key Components',
    questions: [
      {
        question: '5. What are the components of a gas fee?',
        answer: `• Gas Limit - Maximum amount of computational work allowed.\n• Base Fee - Network-suggested fee burned per transaction (EIP-1559).\n• Priority Fee (Tip) - Extra fee to incentivize validators.`
      },
      {
        question: '6. What\'s the difference between Gas Price and Gas Fee?',
        answer: `• Gas Price = Amount per unit (in Gwei).\n• Gas Fee = Gas Price × Gas Used (total cost in ETH).`
      },
      {
        question: '7. What is EIP-1559?',
        answer: `A major Ethereum upgrade that introduced dynamic base fees and burning of ETH, aiming to make gas fees more predictable.`
      }
    ]
  },
  {
    title: 'Section 3: Common Questions',
    questions: [
      {
        question: '8. Why do gas fees fluctuate?',
        answer: `Because of network demand. When the blockchain is busy, users pay more to get their transactions processed faster.`
      },
      {
        question: '9. What happens if I set my gas fee too low?',
        answer: `Your transaction may be delayed indefinitely or dropped if validators don't consider it worth processing.`
      },
      {
        question: '10. Can I cancel a pending transaction?',
        answer: `Yes, by sending a 0 ETH transaction with the same nonce and a higher gas fee – effectively replacing it.`
      },
      {
        question: '11. Are gas fees refundable if my transaction fails?',
        answer: `No. You still pay for the computation up to the point of failure.`
      },
      {
        question: '12. Why do some NFTs or DeFi transactions cost more gas?',
        answer: `More complex smart contracts require more computation, hence higher gas usage.`
      }
    ]
  },
  {
    title: 'Section 4: Misconceptions',
    questions: [
      {
        question: '13. Misconception: Gas is the fee for transferring ETH only.',
        answer: `Correction: Gas is charged for any action on the blockchain: token swaps, mints, approvals, contract interactions.`
      },
      {
        question: '14. Misconception: You only pay gas if the transaction succeeds.',
        answer: `Gas is paid regardless of success, because miners perform computation either way.`
      },
      {
        question: '15. Misconception: Setting a higher gas price increases transaction speed.',
        answer: `That's partly true — higher tips (priority fees) increase the chance of being picked by validators, but base fee still matters.`
      },
      {
        question: '16. Misconception: Gas fees go to Ethereum developers.',
        answer: `Gas fees are burned (base fee) or given to validators, not dev teams.`
      }
    ]
  },
  {
    title: 'Section 5: Advanced Concepts',
    questions: [
      {
        question: '17. What is gas optimization?',
        answer: `It's the practice of writing smart contracts efficiently to reduce the gas needed for execution.`
      },
      {
        question: '18. What is gasless (meta) transaction?',
        answer: `A third party (relayer) pays the gas for users. This is useful for onboarding users with no ETH.`
      },
      {
        question: '19. What is the Ethereum Gas Limit?',
        answer: `Each block has a max gas limit (e.g. ~30 million gas), which restricts how many transactions can fit in one block.`
      },
      {
        question: '20. What is priority gas auction (PGA)?',
        answer: `Users compete by bidding higher gas prices to get transactions processed faster during network congestion.`
      },
      {
        question: '21. How can I estimate or reduce gas costs?',
        answer: `• Use Layer 2 solutions like Arbitrum or Optimism.\n• Schedule transactions during off-peak hours.\n• Use gas trackers like Etherscan or EthGasStation.\n• Optimize contract calls.`
      }
    ]
  },
  {
    title: 'Section 6: Layer 2 and Alternatives',
    questions: [
      {
        question: '22. Do Layer 2s have gas fees?',
        answer: `Yes, but they are significantly lower due to optimized computation and batching.`
      },
      {
        question: '23. What chains have low or zero gas?',
        answer: `• Solana – Low fees due to high throughput.\n• Polygon – L2 sidechain with low costs.\n• StarkNet/ZK Rollups – Efficient Layer 2 tech.\n• Avalanche/Subnets – Customizable fees.`
      },
      {
        question: '24. What is a gas token (e.g., Chi, GST2)?',
        answer: `Gas tokens allow users to prepay and store gas at low prices for later use. Their popularity declined after EIP-3529.`
      }
    ]
  },
  {
    title: 'Section 7: Developer-Specific',
    questions: [
      {
        question: '25. How do I estimate gas in a smart contract?',
        answer: `Use tools like:\n• estimateGas() in Web3.js or Ethers.js\n• Hardhat / Foundry gas reporters\n• Remix IDE's gas estimate`
      },
      {
        question: '26. What is out-of-gas error?',
        answer: `Happens when a transaction exceeds the gas limit. This causes a revert and loss of all gas used.`
      },
      {
        question: '27. Can I write gas-efficient contracts?',
        answer: `Yes. Techniques include:\n• Use 'uint256' over smaller types\n• Avoid 'storage' if not needed\n• Use 'unchecked' blocks where safe`
      }
    ]
  },
  {
    title: 'Section 8: Real-World Scenarios',
    questions: [
      {
        question: '28. Why was my swap on Uniswap expensive?',
        answer: `AMM swaps use complex contracts with multiple steps like approvals and path calculations.`
      },
      {
        question: '29. I tried minting an NFT, and gas spiked — why?',
        answer: `NFT launches can cause gas wars, where users outbid each other to mint limited editions.`
      },
      {
        question: '30. How can I monitor gas prices?',
        answer: `Use gas trackers, dashboards, or on-chain analytics tools to monitor gas prices in real time.`
      }
    ]
  }
];
