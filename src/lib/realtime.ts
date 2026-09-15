export type RealtimeEventMap = {
  'message:new': { conversationId: string; message: { id: string; content: string; createdAt: string; senderId: string } }
  'message:typing': { conversationId: string; userId: string; typing: boolean }
  'message:read': { conversationId: string; messageIds: string[] }
  'notification:new': { id: string; type: string; createdAt: string }
}

export type RealtimeTransport = {
  connect: () => void
  disconnect: () => void
  on: <EventName extends keyof RealtimeEventMap>(event: EventName, handler: (payload: RealtimeEventMap[EventName]) => void) => void
  emit: <EventName extends keyof RealtimeEventMap>(event: EventName, payload: RealtimeEventMap[EventName]) => void
}

// The UI consumes this contract; a Socket.IO adapter can implement it without coupling views to transport details.
export const realtimeConfig = {
  path: '/socket.io',
  transports: ['websocket', 'polling'] as const,
}
