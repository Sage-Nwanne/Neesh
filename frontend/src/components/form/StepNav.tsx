import React from 'react';
import Button from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  nextLabel?: string;
  prevLabel?: string;
}

const StepNav: React.FC<StepNavProps> = ({
  current,
  total,
  onPrev,
  onNext,
  isSubmitting = false,
  nextLabel = 'Next',
  prevLabel = 'Back'
}) => {
  return (
    <div className="flex items-center justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={current === 0 || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        {prevLabel}
      </Button>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{current + 1}</span>
        <span>/</span>
        <span>{total}</span>
      </div>

      <Button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        {nextLabel}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StepNav;
