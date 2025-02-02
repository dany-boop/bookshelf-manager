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

  // const handleSelect = (selectedValue: any) => {
  //   const newValue = value?.includes(selectedValue)
  //     ? value?.filter((v) => v !== selectedValue)
  //     : [...value, selectedValue];
  //   onChange(newValue);
  // };
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
        >
          {value.length > 0 ? value?.join(', ') : placeholder}
          <div className="flex items-center gap-2">
            {value.length > 0 && (
              <button
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              >
                X
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
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
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between "
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
