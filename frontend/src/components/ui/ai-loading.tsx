import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, Settings, FileText, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AILoadingProps {
  isLoading: boolean;
  operation?: 'analyzing' | 'converting' | 'formatting' | 'processing';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

interface AIIndicatorProps {
  isActive: boolean;
  operation?: string;
  className?: string;
}

interface AIParticleProps {
  className?: string;
}

interface AIStatusBadgeProps {
  status: 'idle' | 'processing' | 'success' | 'error';
  operation?: string;
  className?: string;
}

// Animated AI particles effect
export function AIParticles({ className }: AIParticleProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Main AI loading component
export function AILoading({ 
  isLoading, 
  operation = 'processing', 
  size = 'md', 
  showText = true,
  className 
}: AILoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const operationConfig = {
    analyzing: {
      icon: Brain,
      text: 'AI is analyzing...',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    converting: {
      icon: Zap,
      text: 'AI is converting...',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    formatting: {
      icon: Settings,
      text: 'AI is formatting...',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    processing: {
      icon: Sparkles,
      text: 'AI is processing...',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  };

  const config = operationConfig[operation];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn("flex items-center gap-2", className)}
        >
          {/* Animated brain icon with pulsing effect */}
          <motion.div
            className={cn(
              "relative rounded-full flex items-center justify-center",
              config.bgColor,
              sizeClasses[size]
            )}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className={cn(sizeClasses[size], config.color)} />
            
            {/* Pulsing rings */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full border-2 border-current opacity-30",
                config.color
              )}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            
            {/* Secondary pulse ring */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full border border-current opacity-20",
                config.color
              )}
              animate={{ 
                scale: [1, 2, 1],
                opacity: [0.2, 0, 0.2]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                delay: 0.5,
                ease: "easeOut"
              }}
            />
          </motion.div>

          {/* Animated text */}
          {showText && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "font-medium",
                config.color,
                textSizeClasses[size]
              )}
            >
              {config.text}
            </motion.span>
          )}

          {/* Floating particles */}
          <div className="relative w-8 h-6">
            <AIParticles />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Global AI activity indicator (top-right corner)
export function AIIndicator({ isActive, operation, className }: AIIndicatorProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className={cn(
            "fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 shadow-lg",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Brain className="w-4 h-4 text-blue-600" />
            </motion.div>
            <span className="text-sm font-medium text-blue-800">
              {operation ? `AI ${operation}` : 'AI Active'}
            </span>
            
            {/* Animated dots */}
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-blue-500 rounded-full"
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// AI status badge for buttons and cards
export function AIStatusBadge({ status, operation, className }: AIStatusBadgeProps) {
  const statusConfig = {
    idle: {
      icon: Brain,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200'
    },
    processing: {
      icon: Sparkles,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium",
        config.bgColor,
        config.borderColor,
        config.color,
        className
      )}
    >
      {status === 'processing' ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Icon className="w-3 h-3" />
        </motion.div>
      ) : (
        <Icon className="w-3 h-3" />
      )}
      
      <span>
        {status === 'processing' && operation ? `${operation}...` : 
         status === 'success' ? 'Complete' :
         status === 'error' ? 'Failed' : 'AI Ready'}
      </span>
    </motion.div>
  );
}

// Enhanced button with AI animation
interface AIButtonProps {
  isLoading: boolean;
  operation?: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AIButton({ 
  isLoading, 
  operation = 'processing',
  onClick, 
  disabled, 
  children, 
  variant = 'primary',
  size = 'md',
  className 
}: AIButtonProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-200 font-medium rounded-lg flex items-center justify-center gap-2";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300",
    secondary: "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300", 
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
    >
      {/* Animated background for loading state */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ x: '100%' }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Button content */}
      {isLoading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-4 h-4" />
          </motion.div>
          <span>{operation}...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}