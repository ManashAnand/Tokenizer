"use client"

import { useChat } from "@ai-sdk/react"
import { useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  console.log(messages)
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>AI Chat</CardTitle>
        </CardHeader>

        <CardContent className="h-[60vh] overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">Send a message to start the conversation</div>
            ) : (
              <>
                {
                  messages.map(message => (
                    <div key={message.id} className="whitespace-pre-wrap">
                      {message.role === 'user' ? 'User: ' : 'AI: '}
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return <div key={`${message.id}-${i}`}>{part.text}</div>;
                          // case 'tool-invocation':
                          //   return (
                          //     <pre key={`${message.id}-${i}`}>
                          //       {JSON.stringify(part.toolInvocation, null, 2)}
                          //     </pre>
                          //   );
                          default:
                            return null
                        }
                      })}
                    </div>
                  ))
                }
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
