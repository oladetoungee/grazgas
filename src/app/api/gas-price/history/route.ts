import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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
  const range = searchParams.get('range') || '24h';
  
  const chainId = CHAIN_IDS[chain as keyof typeof CHAIN_IDS];
  
  if (!chainId) {
    return NextResponse.json({ error: 'Invalid chain' }, { status: 400 });
  }

  try {
    const auth = Buffer.from(
      process.env.INFURA_API_KEY + ":" + process.env.INFURA_API_KEY_SECRET,
    ).toString("base64");

    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case '1h':
        startDate.setHours(endDate.getHours() - 1);
        break;
      case '24h':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      default:
        startDate.setDate(endDate.getDate() - 1);
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const { data } = await axios.get(
      `https://gas.api.infura.io/networks/${chainId}/history?startDate=${startDateStr}&endDate=${endDateStr}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching historical gas prices:', error);
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Historical data not available for this chain', fallback: true },
        { status: 404 }
      );
    }
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check your Infura credentials.', fallback: true },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch historical gas prices', fallback: true },
      { status: 500 }
    );
  }
} 