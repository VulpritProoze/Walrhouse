import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export type Step = {
  title: string;
  id: number;
};

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <div className={cn('w-full py-4', className)}>
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 h-0.5 w-full bg-muted -z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-300 -z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 bg-background',
                  isCompleted
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isActive
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground',
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-[10px] font-medium uppercase tracking-wider text-center max-w-[80px]',
                  isActive
                    ? 'text-primary bg-background px-1'
                    : 'text-muted-foreground bg-background px-1',
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
