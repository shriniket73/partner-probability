// components/ui/checkbox.tsx

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"
import { FC } from "react"

interface CheckboxProps {
  id?: string // Add 'id' as an optional prop
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const Checkbox: FC<CheckboxProps> = ({ id, checked, onCheckedChange }) => {
  return (
    <CheckboxPrimitive.Root
      id={id} // Pass id to the Root component
      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:primary data-[state=checked]:text-primary-foreground"
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <CheckboxPrimitive.Indicator
      className={"flex items-center justify-center text-current"}
      >
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}