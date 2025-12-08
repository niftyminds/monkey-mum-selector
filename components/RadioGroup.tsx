'use client';

import { FormOption } from '@/types/form';

interface RadioGroupProps {
  name: string;
  options: FormOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function RadioGroup({ name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
            ${value === option.value
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }
          `}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
          />
          <div className="ml-3">
            <span className="block font-medium text-gray-900">{option.label}</span>
            {option.description && (
              <span className="block text-sm text-gray-500 mt-0.5">{option.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
