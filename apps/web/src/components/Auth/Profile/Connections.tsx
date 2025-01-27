"use client"

import { Checkbox } from "@ark-ui/react/checkbox"
import type { ReactNode } from "react"
import type { IconName } from "~/lib/icons"
import Icon from "~/components/Icon"
import { useUser } from "~/lib/promises"

type ConnectionProps = {
  action: any
  value: string
  icon: IconName
  children: ReactNode
}

function Connection({ children, icon, value }: ConnectionProps) {
  return (
    <Checkbox.Root value={value} className="block">
      <Checkbox.Context>
        {(context) => (
          <Checkbox.Control className="group flex items-center gap-4 text-start">
            <div className="grid size-16 flex-none place-items-center rounded-4 bg-not-so-white text-gunpla-white-500 group-data-[state='checked']:bg-gunpla-white-300 group-data-[state='checked']:text-gunpla-white-50">
              <Icon src={icon} className="size-6" alt="" />
            </div>
            <Checkbox.Label className="w-full flex-1">
              {children}
            </Checkbox.Label>
            <div className="flex items-center gap-x-2 text-end">
              {context.checked ? "Connected" : "Disconnected"}
              <Icon
                className="size-3.5"
                src={context.checked ? "CheckCircle" : "CancelCircle"}
                alt=""
              />
            </div>
          </Checkbox.Control>
        )}
      </Checkbox.Context>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}

export default function Connections() {
  const user = useUser()
  const discordUsername = user?.discordUsername
  const twitchUsername = user?.twitchUsername

  return (
    <div className="pb-3 text-xs md:text-sm">
      <div className="gap-x-2 px-3.5 pb-1">Connections</div>
      <Checkbox.Group
        name="connections"
        className="space-y-2"
        value={[
          discordUsername ? "discord" : null,
          twitchUsername ? "twitch" : null,
        ].filter((value) => typeof value === "string")}
        onValueChange={console.log}
        readOnly
      >
        <Connection action={console.log} value="discord" icon="Discord">
          {user?.discordUsername
            ? `Discord @${user.discordUsername}`
            : "Connect to Discord"}
        </Connection>
        <Connection action={console.log} value="twitch" icon="Twitch">
          {user?.twitchUsername
            ? `Twitch @${user.twitchUsername}`
            : "Connect to Twitch"}
        </Connection>
      </Checkbox.Group>
    </div>
  )
}
