// components/ui/slider.tsx

"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[] | number
  onValueChange: (value: number[] | number) => void
  min?: number
  max?: number
  step?: number
  dual?: boolean
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & SliderProps
>(({ value, onValueChange, min = 0, max = 100, step = 1, dual = false, className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    value={Array.isArray(value) ? value : [value]} // Always treat value as an array
    onValueChange={(val) => {
      if (dual) {
        onValueChange(val) // dual mode expects an array of numbers
      } else {
        onValueChange(val[0]) // single mode expects a single number
      }
    }}
    min={min}
    max={max}
    step={step}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-neutral-700">
      <SliderPrimitive.Range className="absolute h-full bg-white" />
    </SliderPrimitive.Track>
    {dual ? (
      <>
        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full bg-black border border-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full bg-black border border-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      </>
    ) : (
      <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full bg-black border border-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    )}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
