import { mastra } from '@/app/mastra'
import { NextResponse } from 'next/server'
 
export const maxDuration = 30;

export async function POST(req: Request) {
  const { city } = await req.json()
  const agent = mastra.getAgent('weatherAgent')
 
  const result = await agent.stream(`What's the weather like in ${city}?`)
 
  return result.toDataStreamResponse()
}