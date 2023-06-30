import { ReactNode } from "react"

import "~/styles/index.css"

import { getUser } from "~/services/auth"
import { getTheme, makeThemeStyle, Theme } from "~/lib/themes"
import Navbar from "~/components/Navbar"
import Toast from "~/components/Toast"

type Props = {
  children: ReactNode
}

export const runtime = "edge"

export default async function Layout({ children }: Props) {
  const user = await getUser()
  const theme = getTheme(Theme["anamorphic-teal"])
  const style = makeThemeStyle(theme)

  return (
    <html
      lang="en"
      className="h-full bg-theme-900 text-gunpla-white-50"
      style={style}
    >
      <body className="h-full min-h-full pl-16">
        <Toast>
          <Navbar user={user} />
          {children}
        </Toast>
      </body>
    </html>
  )
}
