import React from 'react';
import { Progress } from '../ui/progress';

interface StepProgressProps {
  steps: string[];
  current: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ steps, current }) => {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between text-gray-600 mb-3">
        <span className="text-sm font-medium">Step {current + 1} of {steps.length}</span>
        <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex items-center ${
              index <= current ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < current
                  ? 'bg-primary text-white'
                  : index === current
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:block">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
