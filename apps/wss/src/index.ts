import type { ServerWebSocket } from "bun"
import { unreachable } from "@artists-together/core/utils"
import { authenticate } from "@artists-together/auth"
import type { AuthenticateResult } from "@artists-together/auth"
import type { Cursor, ServerEventData } from "@artists-together/core/ws"
import {
  packServerMessage,
  unpackClientMessage,
} from "@artists-together/core/ws"

type WebSocketData = {
  room?: string
  auth: AuthenticateResult
  cursor: Cursor
}

const connections = new Set<ServerWebSocket<WebSocketData>>()

function update(ws: ServerWebSocket<WebSocketData>) {
  connections.delete(ws)
  connections.add(ws)
}

function getRoomState(room: string) {
  return Array.from(connections).reduce<ServerEventData<"room:update">>(
    (state, ws) => {
      if (ws.data.room !== room) return state

      ++state.count

      if (ws.data.auth) {
        state.members.push({
          cursor: ws.data.cursor,
          username: ws.data.auth.user.username,
        })
      }

      return state
    },
    { count: 0, members: [] }
  )
}

const server = Bun.serve<WebSocketData>({
  port: process.env.PORT || 1999,
  async fetch(request, server) {
    const auth = await authenticate(request)

    const upgraded = server.upgrade<WebSocketData>(request, {
      data: {
        auth,
        cursor: null,
      },
    })

    if (!upgraded) {
      return new Response("Upgrade failed", {
        status: 500,
      })
    }
  },
  websocket: {
    open(ws) {
      connections.add(ws)
    },
    close(ws) {
      connections.delete(ws)

      if (!ws.data.room) return

      ws.unsubscribe(ws.data.room)

      server.publish(
        ws.data.room,
        packServerMessage("room:update", getRoomState(ws.data.room))
      )
    },
    async message(ws, message) {
      const parsed = unpackClientMessage(message)

      if (!parsed.success) {
        console.warn("Received invalid message", parsed.error)
        return ws.close(1009, parsed.error.message)
      }

      switch (parsed.data.event) {
        case "room:update":
          // Bail out when trying to join the same room
          if (ws.data.room === parsed.data.payload.room) return

          // Leave the previous room
          if (ws.data.room) {
            const previous = ws.data.room
            delete ws.data.room
            ws.unsubscribe(previous)
            update(ws)

            server.publish(
              previous,
              packServerMessage("room:update", getRoomState(previous))
            )
          }

          // Join the new room
          ws.data.room = parsed.data.payload.room
          ws.subscribe(ws.data.room)
          update(ws)

          ws.send(packServerMessage("room:update", getRoomState(ws.data.room)))

          server.publish(
            ws.data.room,
            packServerMessage("room:update", getRoomState(ws.data.room))
          )
          break
        case "cursor:update":
          if (ws.data.room && ws.data.auth) {
            ws.data.cursor = parsed.data.payload
            update(ws)
            server.publish(
              ws.data.room,
              packServerMessage("cursor:update", {
                cursor: parsed.data.payload,
                username: ws.data.auth.user.username,
              })
            )
          }
          break
        default:
          unreachable(parsed.data, "Unreachable event")
      }
    },
  },
})
