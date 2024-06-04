"use client"

import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
} from "react-aria-components"
import { logout } from "~/services/auth/actions"
import { getAuth } from "~/services/auth/client"

export default function NavigationSidebarProfile() {
  const auth = getAuth()

  if (!auth) return null

  return (
    <DialogTrigger>
      <Button>{auth.user.username}</Button>
      <Modal>
        <Dialog>
          <form action={logout}>
            <Heading slot="title">Log out</Heading>
            <Button type="submit">Pafuera</Button>
          </form>
          <pre>{JSON.stringify(auth, null, 2)}</pre>
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
