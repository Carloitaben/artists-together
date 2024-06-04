import { WEB_URL } from "@artists-together/core/constants"
import FileUpload from "~/components/FileUpload"
import { saveData } from "~/lib/headers"

export default function Page() {
  return (
    <div>
      <div>save data? {saveData() ? "yes" : "no"}</div>
      <div>Inter</div>
      <div className="font-serif">Fraunces</div>
      <div>{WEB_URL.toString()}</div>
      <FileUpload />
    </div>
  )
}
