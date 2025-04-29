'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCategory,
  fetchCategories,
  selectCategories,
} from '@/redux/reducers/categorySlice';
import { AppDispatch, RootState } from '@/redux/store';

interface MultiSelectComboboxProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

export function CustomMultiSelect({
  value = [],
  onChange,
  placeholder,
}: MultiSelectComboboxProps) {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const user = useSelector((state: RootState) => state.auth.user);

  React.useEffect(() => {
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  const filteredCategories = Array.isArray(categories)
    ? categories
        .filter((category) => typeof category.name === 'string')
        .filter((category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  const handleAddNewCategory = async () => {
    if (searchTerm.trim() && user?.id) {
      if (
        !categories.some(
          (cat) => cat.name.toLowerCase() === searchTerm.trim().toLowerCase()
        )
      ) {
        try {
          await dispatch(addCategory({ name: searchTerm.trim() })).unwrap();
          await dispatch(fetchCategories());
          onChange([...value, searchTerm.trim()]);
          setSearchTerm('');
        } catch (error) {
          console.error('Failed to add category:', error);
        }
      }
    }
  };

  const handleSelect = (selectedValue: string) => {
    const selectedCategory = categories.find(
      (cat) => cat.name.toLowerCase() === selectedValue.toLowerCase()
    );

    if (!selectedCategory) return;

    const newValue = value.includes(selectedCategory.name)
      ? value.filter((v) => v !== selectedCategory.name)
      : [...value, selectedCategory.name];

    onChange(newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

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
                className="h-5 w-5 bg-slate-300/20 p-0.5 backdrop-blur-sm backdrop-filter rounded-full "
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
          <CommandInput
            placeholder={placeholder}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="max-h-60 overflow-y-auto">
            {filteredCategories.length === 0 && searchTerm && (
              <CommandEmpty className="flex flex-col items-center gap-2 p-2">
                <Button
                  type="button"
                  onClick={handleAddNewCategory}
                  variant="secondary"
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add "{searchTerm}"
                </Button>
              </CommandEmpty>
            )}
            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => handleSelect(category.name)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.includes(category.name)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
