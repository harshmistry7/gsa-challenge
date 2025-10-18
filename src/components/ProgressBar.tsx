"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Header with Progress Text */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">Progress</span>
        <span className="text-sm font-medium text-blue-600">
          {currentStep}/{totalSteps}
        </span>
      </div>

      {/* ShadCN Progress Bar with gradient fill */}
      <Progress
        value={progress}
        className="h-3 rounded-full bg-gray-200 progress-gradient transition-all duration-500 ease-out"
      />
    </div>
  );
}
