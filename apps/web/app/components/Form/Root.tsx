import { useFetcher, useLocation } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"
import type { Routes } from "remix-routes"
import type { FormProps } from "remix-validated-form"
import { ValidatedForm } from "remix-validated-form"
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip"

type Props<
  DataType extends {
    [fieldName: string]: any
  },
  Subaction extends string | undefined,
> = Omit<FormProps<DataType, Subaction>, "action" | "validator"> &
  Partial<Pick<FormProps<DataType, Subaction>, "validator">> & {
    action?: keyof Routes
  }

const emptyValidator = withZod(z.object({}))

export default function Root<
  DataType extends {
    [fieldName: string]: any
  },
  Subaction extends string | undefined,
>({
  method = "post",
  children,
  action,
  validator,
  navigate = true,
  ...props
}: Props<DataType, Subaction>) {
  const location = useLocation()
  const fetcher = useFetcher<DataType>()

  const validatorFallback =
    validator || (emptyValidator as NonNullable<typeof validator>)

  return (
    <ValidatedForm
      {...props}
      validator={validatorFallback}
      fetcherKey={navigate ? undefined : action}
      fetcher={navigate ? undefined : fetcher}
      navigate={navigate}
      method={method}
      action={action}
    >
      <input type="hidden" name="pathname" value={location.pathname} />
      <TooltipProvider>{children}</TooltipProvider>
    </ValidatedForm>
  )
}
