'use client';

import { FormOption } from '@/types/form';

interface CheckboxGroupProps {
  name: string;
  options: FormOption[];
  value: string[];
  onChange: (values: string[]) => void;
}

export default function CheckboxGroup({ name, options, value, onChange }: CheckboxGroupProps) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
            ${value.includes(option.value)
              ? 'border-primary-500 bg-primary-50'
              : 'border-primary-200 hover:border-primary-300 bg-white'
            }
          `}
        >
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={value.includes(option.value)}
            onChange={() => handleToggle(option.value)}
            className="mt-1 h-4 w-4 rounded text-primary-500 focus:ring-primary-500 border-primary-300"
          />
          <div className="ml-3">
            <span className="block font-medium text-primary-800">{option.label}</span>
            {option.description && (
              <span className="block text-sm text-primary-600 mt-0.5">{option.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
