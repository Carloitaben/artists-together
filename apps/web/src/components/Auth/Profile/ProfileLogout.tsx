import { useLocation } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDialogContext } from "@ark-ui/react/dialog"
import { useForm } from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { authenticateQueryOptions } from "~/services/auth/shared"
import { $logout } from "~/services/auth/actions"
import { toaster } from "~/components/Toasts"
import { AuthFormSchema } from "~/lib/schemas"
import Button from "~/components/Button"

export default function ProfileLogout() {
  const dialog = useDialogContext()
  const client = useQueryClient()
  const pathname = useLocation({
    select: (state) => state.pathname,
  })

  const loginMutation = useMutation({
    mutationFn: $logout,
    async onSuccess() {
      await client.invalidateQueries({
        queryKey: authenticateQueryOptions.queryKey,
      })

      toaster.create({
        type: "success",
        title: "Logged out succesfully",
      })
    },
  })

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithValibot(formData, {
        schema: AuthFormSchema,
      })
    },
    async onSubmit(event, context) {
      event.preventDefault()
      dialog.setOpen(false)
      await loginMutation.mutateAsync({
        data: context.formData,
      })
    },
  })

  return (
    <form method="post" id={form.id} onSubmit={form.onSubmit}>
      <Button type="submit" name={fields.pathname.name} value={pathname}>
        Log off
      </Button>
    </form>
  )
}