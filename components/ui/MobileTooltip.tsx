"use client"
import { useState } from 'react';
import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

interface MobileTooltipProps {
  content: ReactNode;
  iconClassName?: string;
  side?: TooltipSide;
}

export function MobileTooltip({ 
  content, 
  iconClassName = "", 
  side = "right" 
}: MobileTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <HelpCircle 
            className={cn("cursor-pointer", iconClassName)} 
            onClick={() => setIsOpen(!isOpen)}
          />
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={cn(
            "bg-neutral-800 border border-gray-700 text-white",
            "p-2 sm:p-3 md:p-4",
            "text-xs sm:text-sm",
            "max-w-[200px] sm:max-w-[250px] md:max-w-[300px]",
            "rounded-md shadow-lg opacity-90"
          )}
          sideOffset={5}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}