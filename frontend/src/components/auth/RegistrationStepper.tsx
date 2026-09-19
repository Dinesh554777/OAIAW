'use client';
import React from 'react';
import { Check } from 'lucide-react';

interface RegistrationStepperProps {
  currentStep: number;
  steps: string[];
}

export function RegistrationStepper({ currentStep, steps }: RegistrationStepperProps) {
  return (
    <div className="w-full mb-8 relative">
      <div className="flex justify-between items-center relative z-10">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          
          return (
            <div key={idx} className="flex flex-col items-center gap-2 bg-surface px-1">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 ${
                  isCompleted ? 'bg-primary border-primary text-primary-foreground' : 
                  isCurrent ? 'bg-background border-primary text-primary' : 
                  'bg-background border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check size={12} strokeWidth={3} /> : stepNumber}
              </div>
              <span className={`text-[10px] font-medium uppercase tracking-wider ${
                isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Background Line */}
      <div className="absolute top-[11px] left-0 w-full h-[2px] bg-muted-foreground/20 -z-0">
         <div 
           className="h-full bg-primary transition-all duration-300" 
           style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
         />
      </div>
    </div>
  );
}
