import { TerminalSquare } from "lucide-react";
import { motion } from "framer-motion";

interface CyberEmptyProps {
  title: string;
  description: string;
  icon?: React.ElementType;
}

export function CyberEmpty({ title, description, icon: Icon = TerminalSquare }: CyberEmptyProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full h-full min-h-[300px] border border-primary/20 bg-primary/5 p-8 rounded-sm terminal-border text-center"
    >
      <div className="w-16 h-16 mb-4 flex items-center justify-center border border-primary/30 bg-background rounded-sm">
        <Icon className="w-8 h-8 text-primary opacity-80" />
      </div>
      <h3 className="text-xl font-display text-primary mb-2 glow-text-primary">{title}</h3>
      <p className="text-muted-foreground font-mono text-sm max-w-md">{description}</p>
    </motion.div>
  );
}
