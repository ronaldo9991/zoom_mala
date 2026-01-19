import { useState } from "react";
import { MessageCircle, Sparkles, Gem, Clock, Building2, Briefcase } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/assets";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MessageTemplate {
  id: string;
  label: string;
  message: string;
  icon: React.ReactNode;
}

const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "gold-purchase",
    label: "Gold Purchase",
    message: "Hello Zoom Mala Gold & Diamonds LLC, I would like to buy gold. Please share today's rate and available designs.",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: "diamond-inquiry",
    label: "Diamond Inquiry",
    message: "Hello Zoom Mala Gold & Diamonds LLC, I'm interested in certified diamonds. Please share available options.",
    icon: <Gem className="w-4 h-4" />,
  },
  {
    id: "pearls-stones",
    label: "Pearls & Precious Stones",
    message: "Hello Zoom Mala Gold & Diamonds LLC, I'd like to view pearls and precious stones. Please share available collections.",
    icon: <Gem className="w-4 h-4" />,
  },
  {
    id: "watches-clocks",
    label: "Watches & Clocks",
    message: "Hello Zoom Mala Gold & Diamonds LLC, I'm interested in watches and clocks. Please share available options.",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: "visit-office",
    label: "Visit Office",
    message: "Hello Zoom Mala Gold & Diamonds LLC, I plan to visit your office at Gold Souk. Please confirm directions and working hours.",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: "wholesale-business",
    label: "Wholesale / Business",
    message: "Hello Zoom Mala Gold & Diamonds LLC, I'm interested in wholesale trading. Please share the process and requirements.",
    icon: <Briefcase className="w-4 h-4" />,
  },
];

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  const handleMessageSelect = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "fixed bottom-6 right-6 z-50",
                "flex items-center justify-center",
                "w-14 h-14 rounded-full",
                "bg-gold text-white",
                "shadow-lg shadow-gold/20",
                "transition-all duration-300",
                "hover:shadow-xl hover:shadow-gold/30",
                "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background",
                "animate-[pulse-opacity_7s_ease-in-out_infinite]",
                "[@media(prefers-reduced-motion:reduce)]:animate-none"
              )}
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-6 h-6 relative z-10" strokeWidth={2} />
              <span className="sr-only">Chat on WhatsApp</span>
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" className="hidden md:block">
          <p>Chat on WhatsApp</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={12}
        className="w-80 p-0"
      >
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-muted-foreground">
            Start a Conversation
          </h3>
        </div>
        <div className="py-2 max-h-[400px] overflow-y-auto">
          {MESSAGE_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleMessageSelect(template.message)}
              className={cn(
                "w-full px-4 py-3 text-left",
                "flex items-center gap-3",
                "transition-colors duration-150",
                "hover:bg-accent/50",
                "focus:bg-accent/50 focus:outline-none",
                "first:mt-0"
              )}
              aria-label={template.label}
            >
              <div className="text-muted-foreground flex-shrink-0">
                {template.icon}
              </div>
              <span className="text-sm text-foreground font-normal">
                {template.label}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
