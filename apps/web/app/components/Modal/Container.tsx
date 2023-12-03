import type { VariantProps } from "cva"
import { cva } from "cva"
import { forwardRef } from "react"
import type { ComponentProps, ForwardedRef } from "react"

const container = cva({
  base: "rounded-4xl shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]",
  variants: {
    background: {
      true: "bg-gunpla-white-50 text-gunpla-white-500",
      false: "",
    },
    padding: {
      true: "px-8 pb-8 pt-6 sm:px-12 sm:pb-12 sm:pt-10",
      false: "",
    },
  },
  defaultVariants: {
    background: true,
    padding: true,
  },
})

type Props = ComponentProps<"div"> & VariantProps<typeof container>

function Content(
  { className, background, padding, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={container({ className, background, padding })}
    />
  )
}

export default forwardRef(Content)