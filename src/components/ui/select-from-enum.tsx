import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { X } from 'lucide-react';
import { Command, CommandItem, CommandList } from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react';
import { OptionType } from '../data/option-type';

interface SelectFromEnumProps {
  options: OptionType[];
  defaultSelectedValues?: string[]; // Varsayılan seçili değerler
  placeholder?: string;
  onChange?: (selectedValues?: string | string[]) => void; // Tekli veya çoklu seçim
  disabled?: boolean;
  className?: string;
  badgeClassName?: string;
  multiple?: boolean;
  scale: 'xs' | 'sm';
}

export interface SelectFromEnumRef {
  selectedValues: string[];
  input: HTMLInputElement | null;
}

const SelectFromEnum = forwardRef<SelectFromEnumRef, SelectFromEnumProps>(
  (
    {
      options,
      defaultSelectedValues = [],
      placeholder,
      onChange,
      disabled,
      className,
      badgeClassName,
      multiple = false,
      scale = 'sm',
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>(
      multiple
        ? options.filter((option) =>
            defaultSelectedValues.includes(option.value)
          )
        : []
    );

    const [selectedOption, setSelectedOption] = useState<OptionType | null>(
      !multiple && defaultSelectedValues.length > 0
        ? options.find((option) => option.value === defaultSelectedValues[0]) ||
            null
        : null
    );

    useImperativeHandle(ref, () => ({
      selectedValues: multiple
        ? selectedOptions.map((opt) => opt.value)
        : selectedOption
          ? [selectedOption.value]
          : [],
      input: inputRef.current,
    }));

    const handleUnselect = (option: OptionType) => {
      if (multiple) {
        const newSelected = selectedOptions.filter(
          (opt) => opt.value !== option.value
        );
        setSelectedOptions(newSelected);
        onChange?.(newSelected.map((opt) => opt.value));
      } else {
        setSelectedOption(null);
        onChange?.(undefined);
      }
    };

    const handleSelect = (option: OptionType) => {
      if (multiple) {
        if (!selectedOptions.find((opt) => opt.value === option.value)) {
          const newSelected = [...selectedOptions, option];
          setSelectedOptions(newSelected);
          onChange?.(newSelected.map((opt) => opt.value));
        }
      } else {
        setSelectedOption(option);
        onChange?.(option.value);
        setOpen(false); // Tek seçimde listeyi kapat
      }
      setInputValue('');
    };

    const filteredOptions = options.filter((opt) => {
      const isSelected = multiple
        ? selectedOptions.some((sel) => sel.value === opt.value)
        : selectedOption
          ? selectedOption.value === opt.value
          : false;

      return (
        !isSelected &&
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    });

    const { refs, floatingStyles, middlewareData, placement, update } =
      useFloating({
        placement: 'bottom-start',
        middleware: [offset(4), flip(), shift()],
        whileElementsMounted: autoUpdate,
      });

    const setReferenceElement = refs.setReference;
    const setFloatingElement = refs.setFloating;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node) &&
          refs.floating.current &&
          !refs.floating.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open]);

    return (
      <Command shouldFilter={false}>
        <div ref={containerRef}>
          <div
            ref={setReferenceElement}
            className={cn(
              'group rounded-md border border-input px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
              disabled && 'cursor-not-allowed bg-gray-100',
              (multiple
                ? selectedOptions.length > 0
                : selectedOption !== null) && 'py-1.5 ring ring-primary',
              scale === 'xs' && 'py-1'
            )}
          >
            <div className='flex flex-wrap gap-1'>
              {multiple
                ? selectedOptions.map((option) => (
                    <Badge
                      key={option.value}
                      className={cn(badgeClassName, scale === 'xs' && 'py-0.5')}
                    >
                      {option.label}
                      <button
                        className='ml-1 rounded-full focus:outline-none'
                        onClick={() => handleUnselect(option)}
                        disabled={disabled}
                      >
                        <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                      </button>
                    </Badge>
                  ))
                : selectedOption && (
                    <Badge
                      key={selectedOption.value}
                      className={cn(badgeClassName, scale === 'xs' && 'py-0.5')}
                    >
                      {selectedOption.label}
                      <button
                        className='ml-1 rounded-full focus:outline-none'
                        onClick={() => handleUnselect(selectedOption)}
                        disabled={disabled}
                      >
                        <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                      </button>
                    </Badge>
                  )}
              <CommandPrimitive.Input
                ref={inputRef}
                value={inputValue}
                disabled={disabled}
                onValueChange={(value) => {
                  setInputValue(value);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                autoFocus={false}
                placeholder={placeholder}
                className={cn(
                  'ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
                  scale === 'xs' && 'text-xs'
                )}
              />
            </div>
          </div>
        </div>
        {open && (
          <div
            ref={setFloatingElement}
            style={{
              zIndex: 9999,
              width: refs.reference.current
                ? refs.reference.current.getBoundingClientRect().width
                : undefined,
              ...floatingStyles,
            }}
          >
            <CommandList className='max-h-40 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none'>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleSelect(option);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className={cn('cursor-pointer')}
                  >
                    {option.label}
                  </CommandItem>
                ))
              ) : (
                <div className='p-2 text-sm text-muted-foreground'>
                  Sonuç bulunamadı.
                </div>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    );
  }
);

export default SelectFromEnum;
