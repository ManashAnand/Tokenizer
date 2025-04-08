import { mastra } from '@/app/mastra'

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages,publicKey } = await req.json()
  const agent = mastra.getAgent('BlockChainAgent')
  const result = await agent.stream(`${messages[messages.length - 1].content}, given your publicKey is ${publicKey}?`)
  return result.toDataStreamResponse()
}