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
import { useInfiniteQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { OptionType } from '../data/option-type';

interface SelectFromApiProps {
  queryKey: string;
  fetchOptions: (params: {
    page?: number;
    searchName?: string;
    pageSize?: number;
  }) => Promise<OptionType[]>;
  pageSize?: number;
  value?: string | string[];
  defaultOptions?: OptionType[];
  placeholder?: string;
  onChange?: (
    selectedOptions: OptionType | OptionType[] | null
  ) => void | Promise<void>; // Updated type
  disabled?: boolean;
  className?: string;
  badgeClassName?: string;
  dialogOpen?: boolean;
  multiple?: boolean;
  requestParams?: object;
  fetchOnMount?: boolean;
  inputVariant?: 'outlined' | 'text';
  selectOnly?: boolean;
  scale?: 'sm' | 'xs';
}

export interface SelectFromApiRef {
  selectedIds: string[];
  input: HTMLInputElement | null;
}

const SelectFromApi = forwardRef<SelectFromApiRef, SelectFromApiProps>(
  (
    {
      queryKey,
      fetchOptions,
      pageSize = 10,
      value,
      defaultOptions = [],
      placeholder,
      onChange,
      disabled = false,
      className,
      badgeClassName,
      dialogOpen,
      multiple = false,
      requestParams,
      fetchOnMount = false,
      inputVariant = 'outlined',
      selectOnly = false,
      scale = 'sm',
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<OptionType[]>(defaultOptions);

    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch,
      isLoading,
    } = useInfiniteQuery({
      queryKey: [queryKey, inputValue, requestParams],
      queryFn: async ({ pageParam = 1 }) => {
        const data = await fetchOptions({
          page: pageParam,
          searchName: inputValue,
          pageSize,
          ...requestParams,
        });
        return data;
      },
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === pageSize) {
          return allPages.length + 1;
        } else {
          return undefined;
        }
      },
      initialPageParam: 1,
      enabled: fetchOnMount || open,
    });

    const { ref: loadMoreRef, inView } = useInView();

    useImperativeHandle(ref, () => ({
      selectedIds: value ? (Array.isArray(value) ? value : [value]) : [],
      input: inputRef.current,
    }));

    useEffect(() => {
      setOptions([...defaultOptions]);
    }, [disabled]);

    useEffect(() => {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, fetchNextPage]);

    useEffect(() => {
      if (data) {
        const fetchedOptions = data.pages.flatMap((page) => page);
        const allOptions = [
          ...defaultOptions,
          ...fetchedOptions,
          ...selectedOptions,
        ];
        const uniqueOptions = allOptions.reduce<OptionType[]>(
          (acc, current) => {
            if (current && !acc.find((item) => item.value === current.value)) {
              acc.push(current);
            }
            return acc;
          },
          []
        );
        setOptions(uniqueOptions);
      }
    }, [data, defaultOptions]);

    const selectedIds = value ? (Array.isArray(value) ? value : [value]) : [];

    const selectedOptions = options?.filter((opt) =>
      selectedIds.includes(opt?.value ?? '')
    );

    const handleUnselect = async (option?: OptionType) => {
      if (disabled && !option) return;
      if (multiple) {
        const newOptions = selectedOptions.filter(
          (opt) => opt.value !== option?.value
        );
        await onChange?.(newOptions.length > 0 ? newOptions : null);
      } else {
        await onChange?.(null);
      }
    };

    const handleSelect = async (option: OptionType) => {
      if (disabled) return;
      if (multiple) {
        const exists = selectedOptions.some(
          (opt) => opt.value === option.value
        );
        if (!exists) {
          const newOptions = [...selectedOptions, option];
          await onChange?.(newOptions);
        }
      } else {
        await onChange?.(option);
        setOpen(false);
      }

      setInputValue('');
    };

    const filteredOptions = options?.filter((opt) => {
      return !selectedIds.includes(opt?.value ?? '');
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
      <Command shouldFilter={false} className={className}>
        <div
          ref={containerRef}
          className={cn(
            'cursor-pointer transition-colors duration-200 ease-in-out',
            'hover:bg-slate-50 dark:hover:bg-slate-900'
          )}
          onClick={() => (disabled === false ? setOpen(true) : null)}
          onBlur={() => setOpen(false)}
        >
          <div
            ref={setReferenceElement}
            className={cn(
              'group cursor-pointer rounded-md px-1 py-1 text-sm',
              disabled && 'cursor-not-allowed bg-gray-100',
              // selectedIds.length > 0 ? 'ring-1 ring-primary' : '',
              inputVariant === 'outlined'
                ? 'border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
                : 'border-none bg-transparent ring-0 focus-within:ring-2 focus-within:ring-offset-0',
              inputVariant === 'text' && open && 'border ring-2 ring-primary',
              scale === 'xs' && 'py-1'
            )}
          >
            <div className='flex min-w-32 flex-row flex-wrap gap-4 px-2'>
              {!multiple && selectOnly ? (
                <div className='text-sm font-medium'>
                  {selectedOptions?.[0]?.label}
                </div>
              ) : (
                selectedOptions?.map((option) => (
                  <div className='flex flex-wrap gap-2'>
                    <Badge
                      key={option?.value}
                      className={cn(badgeClassName, scale === 'xs' && 'py-0.5')}
                    >
                      {option?.label}
                      <button
                        className='ml-1 rounded-full focus:outline-none'
                        onClick={(e) => {
                          handleUnselect(option);
                          e.stopPropagation();
                        }}
                        type='button'
                        disabled={disabled}
                      >
                        <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                      </button>
                    </Badge>
                  </div>
                ))
              )}

              <div className='flex w-full flex-1' tabIndex={-1}>
                <div className='flex w-full items-center justify-end'>
                  {!selectOnly && (
                    <input
                      ref={inputRef}
                      value={inputValue}
                      disabled={disabled}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                      }}
                      autoFocus={false}
                      placeholder={
                        selectedIds.length > 0 && multiple == false
                          ? ''
                          : placeholder
                      }
                      className={cn(
                        'ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
                        scale === 'xs' && 'text-xs'
                      )}
                      autoComplete='off'
                      role='presentation'
                      type='text'
                    />
                  )}
                  <IconCaretDownFilled className='h-4 w-4 text-muted-foreground' />
                </div>
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
              {filteredOptions && filteredOptions.length > 0 ? (
                <>
                  {filteredOptions?.map((option) => (
                    <CommandItem
                      key={option?.value}
                      value={option?.value}
                      onSelect={() => {
                        if (option) handleSelect(option);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className={cn(
                        'cursor-pointer',
                        scale === 'xs' && 'py-1 text-xs'
                      )}
                    >
                      {option?.label}
                    </CommandItem>
                  ))}
                  <div ref={loadMoreRef}>
                    {isFetchingNextPage && <div>Loading more...</div>}
                  </div>
                </>
              ) : isLoading ? (
                <div className='p-2 text-sm text-muted-foreground'>
                  Yükleniyor...
                </div>
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

export default SelectFromApi;
