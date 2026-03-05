'use client';

import { SideLength } from '@/types/form';
import { LENGTH_OPTIONS } from '@/lib/config';

interface MultiLengthFieldProps {
  sideCount: number;
  value: SideLength[];
  onChange: (lengths: SideLength[]) => void;
}

export default function MultiLengthField({ sideCount, value, onChange }: MultiLengthFieldProps) {
  const handleLengthChange = (sideIndex: number, rawValue: string) => {
    const updated = [...value];
    const existing = updated.findIndex((s) => s.sideIndex === sideIndex);

    if (rawValue === 'jine') {
      const entry: SideLength = { sideIndex, length: 'jine', customLength: undefined };
      if (existing >= 0) {
        updated[existing] = entry;
      } else {
        updated.push(entry);
      }
    } else {
      const numValue = parseInt(rawValue, 10);
      const entry: SideLength = { sideIndex, length: numValue };
      if (existing >= 0) {
        updated[existing] = entry;
      } else {
        updated.push(entry);
      }
    }

    onChange(updated);
  };

  const handleCustomLengthChange = (sideIndex: number, customValue: string) => {
    const updated = [...value];
    const existing = updated.findIndex((s) => s.sideIndex === sideIndex);
    if (existing >= 0) {
      updated[existing] = {
        ...updated[existing],
        customLength: customValue ? parseInt(customValue, 10) : undefined,
      };
      onChange(updated);
    }
  };

  const getSideValue = (sideIndex: number): string => {
    const side = value.find((s) => s.sideIndex === sideIndex);
    if (!side) return '';
    if (side.length === 'jine') return 'jine';
    return String(side.length);
  };

  const getSideCustomLength = (sideIndex: number): string => {
    const side = value.find((s) => s.sideIndex === sideIndex);
    if (!side || side.length !== 'jine') return '';
    return side.customLength ? String(side.customLength) : '';
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: sideCount }, (_, i) => (
        <div key={i} className="space-y-2">
          <label className="block text-sm font-medium text-primary-700">
            Strana {i + 1}
          </label>
          <select
            value={getSideValue(i)}
            onChange={(e) => handleLengthChange(i, e.target.value)}
            className="
              w-full p-4 rounded-lg border-2 border-primary-200 bg-white
              text-primary-800 font-medium
              focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none
              transition-all cursor-pointer
              appearance-none
              bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')]
              bg-[length:12px_12px]
              bg-[right_16px_center]
              bg-no-repeat
              pr-12
            "
          >
            <option value="" disabled>
              Vyberte délku...
            </option>
            {LENGTH_OPTIONS.map((l) => (
              <option key={l} value={String(l)}>
                {l} cm
              </option>
            ))}
            <option value="jine">Jiné</option>
          </select>

          {getSideValue(i) === 'jine' && (
            <input
              type="number"
              placeholder="Zadejte délku v cm"
              value={getSideCustomLength(i)}
              onChange={(e) => handleCustomLengthChange(i, e.target.value)}
              min={50}
              max={300}
              className="
                w-full p-3 rounded-lg border-2 border-primary-200 bg-white
                text-primary-800
                focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none
                transition-all
              "
            />
          )}
        </div>
      ))}
    </div>
  );
}
