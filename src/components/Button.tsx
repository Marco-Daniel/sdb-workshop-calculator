import { VariantProps, cva } from "class-variance-authority";

const variants = cva("flex justify-center px-6 py-4 focus:outline-none", {
  variants: {
    variant: {
      primary: "bg-orange-400 hover:bg-orange-400/90 focus:bg-orange-400/75",
      secondary:
        "bg-neutral-600 hover:bg-neutral-600/90 focus:bg-neutral-600/75",
      tertiary:
        "bg-neutral-500 hover:bg-neutral-500/90 focus:bg-neutral-500/75",
    },
    span: {
      0: "col-span-1",
      1: "col-span-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    span: 0,
  },
});

export interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

export default function Button({
  children,
  span,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button className={variants({ span, variant })} {...props}>
      <span className=" col text-white text-xl">{children}</span>
    </button>
  );
}
