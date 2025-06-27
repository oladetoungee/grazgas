import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Chain ID mapping
const CHAIN_IDS = {
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  optimism: 10,
  polygon: 137,
  scroll: 534352,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain') || 'ethereum';
  
  const chainId = CHAIN_IDS[chain as keyof typeof CHAIN_IDS];
  
  if (!chainId) {
    return NextResponse.json({ error: 'Invalid chain' }, { status: 400 });
  }

  try {
    const auth = Buffer.from(
      process.env.INFURA_API_KEY + ":" + process.env.INFURA_API_KEY_SECRET,
    ).toString("base64");

    const { data } = await axios.get(
      `https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching gas prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gas prices' },
      { status: 500 }
    );
  }
} 