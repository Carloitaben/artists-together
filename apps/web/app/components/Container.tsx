import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import type { VariantProps } from "cva"
import { cva } from "cva"

export const cols = "grid-cols-4 sm:grid-cols-8"
export const gap = "fluid:gap-4"

const container = cva({
  base: "w-full",
  variants: {
    padding: {
      true: "px-4 sm:pl-0",
      false: "",
    },
    grid: {
      true: ["grid", cols, gap],
      false: "",
    },
  },
  defaultVariants: {
    grid: false,
    padding: true,
  },
})

type Props = ComponentProps<"div"> & VariantProps<typeof container>

function Container(
  { className, children, grid, padding, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={container({ grid, padding, className })}
    >
      {children}
    </div>
  )
}

export default forwardRef(Container)