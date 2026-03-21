"use client";

import React, { useState } from "react";

interface ModernSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  showValue?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "accent";
  marks?: { value: number; label: string }[];
}

export default function ModernSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = "",
  showValue = true,
  disabled = false,
  size = "md",
  color = "primary",
  marks = [],
}: ModernSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getColorClasses = () => {
    const colors = {
      primary: {
        track: "bg-gradient-to-r from-[#2563EB] to-[#1E40AF]",
        thumb: "bg-[#2563EB] border-white shadow-lg shadow-blue-500/25",
        thumbHover: "bg-[#1E40AF] shadow-xl shadow-blue-500/40",
        value: "text-[#2563EB]",
      },
      success: {
        track: "bg-gradient-to-r from-[#22C55E] to-[#16A34A]",
        thumb: "bg-[#22C55E] border-white shadow-lg shadow-green-500/25",
        thumbHover: "bg-[#16A34A] shadow-xl shadow-green-500/40",
        value: "text-[#22C55E]",
      },
      accent: {
        track: "bg-gradient-to-r from-[#F97316] to-[#EA580C]",
        thumb: "bg-[#F97316] border-white shadow-lg shadow-orange-500/25",
        thumbHover: "bg-[#EA580C] shadow-xl shadow-orange-500/40",
        value: "text-[#F97316]",
      },
    };
    return colors[color];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: {
        thumb: "w-4 h-4",
        track: "h-1.5",
        label: "text-sm",
        value: "text-sm",
      },
      md: {
        thumb: "w-5 h-5",
        track: "h-2",
        label: "text-base",
        value: "text-base",
      },
      lg: {
        thumb: "w-6 h-6",
        track: "h-3",
        label: "text-lg",
        value: "text-lg",
      },
    };
    return sizes[size];
  };

  const colorClasses = getColorClasses();
  const sizeClasses = getSizeClasses();
  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!disabled) {
          const rect = document.getElementById(`slider-${label}`)?.getBoundingClientRect();
          if (rect) {
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            const newValue = min + (percentage / 100) * (max - min);
            const steppedValue = Math.round(newValue / step) * step;
            onChange(Math.max(min, Math.min(max, steppedValue)));
          }
        }
      };

      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);

      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }
  }, [isDragging, disabled, min, max, step, onChange]);

  return (
    <div className={`w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {/* Label and Value */}
      <div className="flex items-center justify-between mb-3">
        <label className={`${sizeClasses.label} font-semibold text-[#0F172A]`}>
          {label}
        </label>
        {showValue && (
          <div className={`flex items-center gap-1 ${sizeClasses.value} font-bold ${colorClasses.value}`}>
            <span>{value}</span>
            {unit && <span className="text-[#64748B] font-normal">{unit}</span>}
          </div>
        )}
      </div>

      {/* Slider Container */}
      <div
        id={`slider-${label}`}
        className="relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Track Background */}
        <div className={`absolute inset-0 ${sizeClasses.track} bg-[#E2E8F0] rounded-full`} />
        
        {/* Active Track */}
        <div
          className={`absolute inset-y-0 left-0 ${sizeClasses.track} ${colorClasses.track} rounded-full transition-all duration-200`}
          style={{ width: `${percentage}%` }}
        />

        {/* Marks */}
        {marks.length > 0 && (
          <div className="absolute inset-0 flex items-center">
            {marks.map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${markPercentage}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-1 h-3 bg-[#E2E8F0] rounded-full" />
                  <span className="text-xs text-[#64748B] mt-1">{mark.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${sizeClasses.thumb} ${colorClasses.thumb} rounded-full border-2 cursor-pointer transition-all duration-200 hover:${colorClasses.thumbHover} ${isDragging ? colorClasses.thumbHover : ''}`}
          style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-1 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-[#64748B]">{min}{unit}</span>
        <span className="text-xs text-[#64748B]">{max}{unit}</span>
      </div>
    </div>
  );
}

// Example usage component
export function SliderExample() {
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(50);
  const [students, setStudents] = useState(5);
  const [difficulty, setDifficulty] = useState(3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#FFFFFF] rounded-2xl shadow-lg p-8 border border-[#E2E8F0]">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8">Modern Slider Examples</h2>
          
          <div className="space-y-8">
            {/* Primary Slider */}
            <ModernSlider
              label="Session Duration"
              min={30}
              max={180}
              step={15}
              value={duration}
              onChange={setDuration}
              unit="min"
              color="primary"
              size="md"
              marks={[
                { value: 30, label: "30m" },
                { value: 60, label: "1h" },
                { value: 120, label: "2h" },
                { value: 180, label: "3h" },
              ]}
            />

            {/* Success Slider */}
            <ModernSlider
              label="Price per Session"
              min={20}
              max={200}
              step={10}
              value={price}
              onChange={setPrice}
              unit="$"
              color="success"
              size="lg"
              marks={[
                { value: 20, label: "$20" },
                { value: 100, label: "$100" },
                { value: 200, label: "$200" },
              ]}
            />

            {/* Accent Slider */}
            <ModernSlider
              label="Max Students"
              min={1}
              max={20}
              step={1}
              value={students}
              onChange={setStudents}
              color="accent"
              size="md"
              marks={[
                { value: 1, label: "1" },
                { value: 10, label: "10" },
                { value: 20, label: "20" },
              ]}
            />

            {/* Small Slider */}
            <ModernSlider
              label="Difficulty Level"
              min={1}
              max={5}
              step={1}
              value={difficulty}
              onChange={setDifficulty}
              color="primary"
              size="sm"
              marks={[
                { value: 1, label: "Beginner" },
                { value: 3, label: "Intermediate" },
                { value: 5, label: "Advanced" },
              ]}
            />

            {/* Disabled Slider */}
            <ModernSlider
              label="Disabled Slider"
              min={0}
              max={100}
              value={50}
              onChange={() => {}}
              disabled={true}
              color="primary"
              size="md"
            />
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Current Settings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-[#64748B]">Duration:</span>
                <span className="ml-2 font-medium text-[#0F172A]">{duration}min</span>
              </div>
              <div>
                <span className="text-[#64748B]">Price:</span>
                <span className="ml-2 font-medium text-[#0F172A]">${price}</span>
              </div>
              <div>
                <span className="text-[#64748B]">Students:</span>
                <span className="ml-2 font-medium text-[#0F172A]">{students}</span>
              </div>
              <div>
                <span className="text-[#64748B]">Difficulty:</span>
                <span className="ml-2 font-medium text-[#0F172A]">{difficulty}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
