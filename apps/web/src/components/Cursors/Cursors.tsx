import { Suspense, lazy } from "react"
import { useScreen } from "~/hooks/media"
import { useWebSocket } from "~/components/WebSocket"
import Me from "./Me"

const CursorPresenceRoom = lazy(() => import("./CursorPresenceRoom"))

export default function Cursors() {
  const ws = useWebSocket()
  const sm = useScreen("sm")

  const render = ws && sm

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 isolate size-full select-none overflow-hidden"
      >
        {render ? (
          <Suspense>
            <CursorPresenceRoom />
          </Suspense>
        ) : null}
      </div>
      <Me />
    </>
  )
}
