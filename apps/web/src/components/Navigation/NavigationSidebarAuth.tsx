"use client"

import { usePathname } from "next/navigation"
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
} from "react-aria-components"
import { login } from "~/services/auth/actions"

export default function NavigationSidebarAuth() {
  const pathname = usePathname()

  return (
    <DialogTrigger>
      <Button>Sign up…</Button>
      <Modal>
        <Dialog>
          <form action={login.bind(null, pathname)}>
            <Heading slot="title">Sign up</Heading>
            <Button type="submit">Discord</Button>
          </form>
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
