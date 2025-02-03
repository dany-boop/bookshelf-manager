'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MultiSelectComboboxProps {
  options: string[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

interface SingleSelectComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

// MultiSelect Combobox
export function MultiSelectCombobox({
  options,
  value = [],
  onChange,
  placeholder,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedValue: string) => {
    const normalizedOption = options.find(
      (opt) => opt.toLowerCase() === selectedValue.toLowerCase()
    );

    if (!normalizedOption) return; // Prevent invalid selections

    const newValue = value?.includes(normalizedOption)
      ? value?.filter((v) => v !== normalizedOption)
      : [...value, normalizedOption];

    onChange(newValue);
  };

  // Clear All Selections
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  // Use the full value string (or placeholder) for the tooltip

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="relative">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="md:min-w-40 w-full flex items-center justify-between overflow-hidden focus:border-green-500"
        >
          <span
            className="overflow-hidden max-w-32 min-w-32 text-ellipsis"
            title={value.length > 0 ? value.join(', ') : placeholder}
          >
            {value.length > 0 ? value.join(', ') : placeholder}
          </span>
          <div className="flex absolute items-center right-1 gap-2 ">
            {value.length > 0 && (
              <button
                type="button"
                className="h-5 w-5 bg-slate-300/20 p-0.5  backdrop-blur-sm backdrop-filter rounded-full "
                onClick={handleClear}
              >
                X
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option} onSelect={() => handleSelect(option)}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value?.includes(option) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function SingleSelectCombobox({
  options,
  value,
  onChange,
  placeholder,
}: SingleSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="relative">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="md:min-w-40 w-full justify-between focus:border-green-500"
        >
          {value || placeholder}
          <div className="flex absolute items-center right-1 gap-2 ">
            {value.length > 0 && (
              <button
                type="button"
                className="h-5 w-5 bg-slate-300/20 p-0.5  backdrop-blur-sm backdrop-filter rounded-full "
                onClick={handleClear}
              >
                X
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>{' '}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    onChange(option);
                    console.log('option', option);
                    // setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
