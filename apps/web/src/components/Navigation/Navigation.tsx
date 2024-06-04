import type { ReactNode } from "react"
import NavigationSidebar from "./NavigationSidebar"

type Props = {
  children: ReactNode
}

export default function Navigation({ children }: Props) {
  return (
    <>
      <NavigationSidebar />
      {children}
    </>
  )
}
