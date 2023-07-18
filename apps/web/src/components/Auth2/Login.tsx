"use client"

import { login } from "~/actions/auth"
import { loginSchema } from "~/actions/schemas"
import { useForm, withAction, PropsWithAction } from "~/hooks/form"
import { useToast } from "~/components/Toast"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form2"

type Props = PropsWithAction<typeof login> & {
  onSuccess: (email: string) => void
}

function LoginForm({ action, onSuccess }: Props) {
  const { emit } = useToast()
  const { root, field, formState, setError } = useForm({
    action,
    schema: loginSchema,
    onError: () => {
      emit({ title: "Oops! Something went wrong" })
    },
    onSubmit: (data, input) => {
      if ("error" in data) {
        switch (data.error) {
          case "ALREADY_LOGGED_IN":
            emit({ title: "Oops! You cannot do that" })
            break
          case "USER_DOES_NOT_EXIST":
            setError("email", {
              type: "custom",
              message: "No account with that email exists",
            })
            break
          default:
            emit({ title: "Oops! Something went wrong" })
        }
      } else {
        onSuccess(input.email)
      }
    },
  })

  return (
    <Form.Root {...root()}>
      <Modal.Container>
        <Modal.Title inset>Log-in</Modal.Title>
        <Form.Field {...field("email")}>
          <Form.Label>Email address</Form.Label>
          <Form.Input type="email" placeholder="johndoe@email.com" />
          <Form.Error />
        </Form.Field>
      </Modal.Container>
      <button>submit</button>
    </Form.Root>
  )
}

export default withAction(LoginForm, login)
