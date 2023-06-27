import { userSchema } from "db"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { auth, getOtp } from "~/services/auth"

const schema = userSchema.pick({ username: true, email: true })

export async function POST(request: Request) {
  const data = schema.parse(
    Object.fromEntries((await request.formData()).entries())
  )

  const authRequest = auth.handleRequest({
    request,
    cookies,
  })

  const { session } = await authRequest.validateUser()

  if (session) {
    return NextResponse.json({ error: "Already logged in" }, { status: 400 })
  }

  try {
    const user = await auth.createUser({
      primaryKey: {
        providerId: "email",
        providerUserId: data.email,
        password: null,
      },
      attributes: {
        bio: null,
        email: data.email,
        username: data.username,
      },
    })

    const otp = await getOtp(user.id)

    console.log(`Send to email ${data.email} otp code: ${otp.toString()}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
