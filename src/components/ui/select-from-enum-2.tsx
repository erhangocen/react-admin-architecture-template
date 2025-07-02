import { Badge } from '@/components/ui/badge';
import { Command, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { IconCaretDownFilled } from '@tabler/icons-react';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

interface Option {
  value: number | string;
  label: string;
}

interface SelectFromEnum2Props {
  options: Option[];
  value?: number | string | (number | string)[];
  placeholder?: string;
  onChange?: (selectedValues?: number | string | (number | string)[]) => void;
  disabled?: boolean;
  className?: string;
  badgeClassName?: string;
  multiple?: boolean;
  allowCustomOption?: boolean;
  scale?: 'xs' | 'sm';
  selectOnly?: boolean;
}

export interface SelectFromEnum2Ref {
  selectedValues: (number | string)[];
  input: HTMLInputElement | null;
}

const SelectFromEnum2 = forwardRef<SelectFromEnum2Ref, SelectFromEnum2Props>(
  (
    {
      options,
      value,
      placeholder,
      onChange,
      disabled = false,
      className,
      badgeClassName,
      multiple = false,
      allowCustomOption = false,
      scale = 'sm',
      selectOnly = false,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [additionalOptions, setAdditionalOptions] = useState<Option[]>([]);

    const allOptions = useMemo(
      () => [...options, ...additionalOptions],
      [options, additionalOptions]
    );

    useImperativeHandle(ref, () => ({
      selectedValues: multiple
        ? Array.isArray(value)
          ? (value as (number | string)[])
          : []
        : value !== undefined && !Array.isArray(value)
          ? [value as number | string]
          : [],
      input: inputRef.current,
    }));

    const handleUnselect = (option: Option) => {
      if (disabled) return;
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newSelectedValues = currentValues.filter(
          (v) => v !== option.value
        );
        onChange?.(newSelectedValues);
      } else {
        onChange?.(undefined);
      }
      if (allowCustomOption) {
        setAdditionalOptions((prev) =>
          prev.filter((opt) => opt.value !== option.value)
        );
      }
    };

    const handleSelect = (option: Option) => {
      if (disabled) return;
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        if (!currentValues.includes(option.value)) {
          const newSelectedValues = [...currentValues, option.value];
          onChange?.(newSelectedValues);
        }
      } else {
        onChange?.(option.value);
        if (!allowCustomOption) setOpen(false);
      }
      setInputValue('');
    };

    const filteredOptions = allOptions.filter((opt) => {
      const isSelected = multiple
        ? (Array.isArray(value) ? value : []).includes(opt.value)
        : value === opt.value;

      return (
        !isSelected &&
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    });

    const { refs, floatingStyles } = useFloating({
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
    }, [open, refs.floating]);

    return (
      <Command shouldFilter={false}>
        <div
          className={cn('hover:bg-slate-50 dark:hover:bg-slate-900')}
          ref={containerRef}
          onClick={() => (disabled === false ? setOpen(true) : null)}
          onBlur={() => setOpen(false)}
        >
          <div
            ref={setReferenceElement}
            className={cn(
              'group rounded-md border border-input px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
              disabled && 'cursor-not-allowed bg-gray-100',
              (multiple
                ? Array.isArray(value) && value.length > 0
                : value !== undefined) && 'py-1.5 ring ring-primary',
              scale === 'xs' && 'py-0.5'
            )}
          >
            <div
              className={cn(
                'flex w-full flex-row items-center justify-between gap-1',
                multiple && 'flex-wrap'
              )}
            >
              {!multiple && selectOnly && (
                <div
                  className={cn(
                    'text-sm font-medium',
                    scale == 'xs' && 'text-xs'
                  )}
                >
                  {
                    allOptions.find(
                      (opt) =>
                        opt.value === (Array.isArray(value) ? value[0] : value)
                    )?.label
                  }
                </div>
              )}
              {multiple
                ? (Array.isArray(value) ? value : []).map((val) => {
                    const option = allOptions.find((opt) => opt.value === val);
                    return (
                      option && (
                        <Badge
                          key={option.value.toString()}
                          className={cn(
                            badgeClassName,
                            scale === 'xs' && 'py-0.5'
                          )}
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
                      )
                    );
                  })
                : !selectOnly &&
                  (() => {
                    const option = allOptions.find(
                      (opt) => opt.value === value
                    );
                    return (
                      option && (
                        <Badge
                          key={option.value.toString()}
                          className={cn(
                            badgeClassName,
                            scale === 'xs' && 'py-0.5'
                          )}
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
                      )
                    );
                  })()}

              {!selectOnly && (
                <CommandPrimitive.Input
                  ref={inputRef}
                  value={inputValue}
                  disabled={disabled}
                  onValueChange={(value) => {
                    setInputValue(value);
                  }}
                  placeholder={placeholder}
                  className={cn(
                    'ml-2 h-min flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground',
                    'w-3',
                    scale === 'xs' && 'text-xs'
                  )}
                />
              )}
              <div className='flex h-full items-center'>
                <IconCaretDownFilled className='h-3 w-3 text-muted-foreground' />
              </div>
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
                    key={option.value.toString()}
                    value={option.value.toString()}
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
                    className={cn(
                      'cursor-pointer',
                      scale === 'xs' && 'py-1 text-xs'
                    )}
                  >
                    {option.label}
                  </CommandItem>
                ))
              ) : allowCustomOption && inputValue.trim() !== '' ? (
                <CommandItem
                  key={'custom-option'}
                  value={inputValue}
                  onSelect={() => {
                    setAdditionalOptions((prev) =>
                      multiple
                        ? [...prev, { label: inputValue, value: inputValue }]
                        : [{ label: inputValue, value: inputValue }]
                    );
                    handleSelect({ label: inputValue, value: inputValue });
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className={cn(
                    'cursor-pointer',
                    scale === 'xs' && 'py-1 text-xs'
                  )}
                >
                  {`"${inputValue}" olarak ekle`}
                </CommandItem>
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

export default SelectFromEnum2;
