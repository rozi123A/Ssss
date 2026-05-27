import { motion } from "framer-motion";

export function CyberSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center w-full h-full min-h-[200px] ${className}`}>
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-primary border-r-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 border-2 border-transparent border-b-secondary border-l-secondary rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-primary font-mono text-xs">
          NEX
        </div>
      </div>
    </div>
  );
}
