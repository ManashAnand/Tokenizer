import { mastra } from '@/app/mastra'
import { NextResponse } from 'next/server'

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json()
  const agent = mastra.getAgent('weatherAgent')
  const result = await agent.stream(`${messages[messages.length - 1].content}?`)
  return result.toDataStreamResponse()
}