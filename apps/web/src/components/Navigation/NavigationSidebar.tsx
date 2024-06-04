import Link from "next/link"
import { cookies } from "next/headers"
import { authenticate } from "~/services/auth/server"
import NavigationSidebarAuth from "./NavigationSidebarAuth"
import NavigationSidebarProfile from "./NavigationSidebarProfile"

function getCalendarURL() {
  switch (cookies().get("calendar")?.value) {
    case "months":
      return "/calendar/2024"
    case "days":
    default:
      return "/calendar/2024/11"
  }
}

export default async function NavigationSidebar() {
  const auth = await authenticate()

  return (
    <div>
      <div>
        {auth ? <NavigationSidebarProfile /> : <NavigationSidebarAuth />}
      </div>
      <div>
        <Link href="/">/</Link>
      </div>
      <div>
        <Link href="/about">/about</Link>
      </div>
      <div>
        <Link href="/lounge">/lounge</Link>
      </div>
      <div>
        <Link href="/art">/art</Link>
      </div>
      <div>
        <Link href={getCalendarURL()}>/calendar</Link>
      </div>
    </div>
  )
}
