import { notFound } from "next/navigation"

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return <div>calendar year month</div>
}