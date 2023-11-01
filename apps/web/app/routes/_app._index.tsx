import type { MetaFunction } from "@remix-run/node"
import Container from "~/components/Container"
import WidgetTheme from "~/components/WidgetTheme"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export const handle = {
  actions: {},
}

export default function Index() {
  return (
    <Container grid>
      <h1 className="text-red-500">:)</h1>
      <WidgetTheme />
    </Container>
  )
}
