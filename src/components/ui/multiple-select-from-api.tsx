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
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib/debounce';

export interface Option {
  value: string;
  label: string;
}

interface MultipleSelectFromApiProps<T> {
  queryKey: string;
  fetchOptions: (params: {
    pageParam?: number;
    query: string;
    pageSize: number;
  }) => Promise<T[]>;
  valueKey: keyof T;
  labelKey: keyof T;
  pageSize?: number;
  defaultSelecteds?: T[];
  placeholder?: string;
  onChange?: (ids: string[]) => void;
  disabled?: boolean;
  className?: string;
  badgeClassName?: string;
  dialogOpen?: boolean;
}

export interface MultipleSelectFromApiRef {
  selectedIds: string[];
  input: HTMLInputElement | null;
}

function MultipleSelectFromApi<T extends Record<string, any>>(
  {
    queryKey,
    fetchOptions,
    valueKey,
    labelKey,
    pageSize = 10,
    defaultSelecteds = [],
    placeholder,
    onChange,
    disabled,
    className,
    badgeClassName,
    dialogOpen,
  }: MultipleSelectFromApiProps<T>,
  ref: React.Ref<MultipleSelectFromApiRef>
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    defaultSelecteds.map((item) => ({
      value: String(item[valueKey]),
      label: String(item[labelKey]),
    }))
  );
  const [options, setOptions] = useState<Option[]>([]);

  const debouncedInputValue = useDebounce(inputValue, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: [queryKey, debouncedInputValue],
      queryFn: async ({ pageParam = 1 }) => {
        const data = await fetchOptions({
          pageParam,
          query: inputValue,
          pageSize,
        });
        return data;
      },
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === pageSize) {
          return allPages.length + 1; // Next page number
        } else {
          return undefined; // No more pages
        }
      },
      initialPageParam: 1,
      enabled: open,
    });

  const { ref: loadMoreRef, inView } = useInView();

  useImperativeHandle(ref, () => ({
    selectedIds: selectedOptions.map((opt) => opt.value),
    input: inputRef.current,
  }));

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (data) {
      const newOptions = data.pages.flatMap((page) =>
        page.map((item) => ({
          value: String(item[valueKey]),
          label: String(item[labelKey]),
        }))
      );
      setOptions(newOptions);
    }
  }, [data, valueKey, labelKey]);

  const handleUnselect = (option: Option) => {
    setSelectedOptions((prev) =>
      prev.filter((opt) => opt.value !== option.value)
    );
    onChange?.(selectedOptions.map((opt) => opt.value));
  };

  const handleSelect = (option: Option) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((opt) => opt.value === option.value);
      if (!exists) {
        const newSelected = [...prev, option];
        onChange?.(newSelected.map((opt) => opt.value));
        return newSelected;
      }
      return prev;
    });
    setInputValue(''); // Reset the input field
  };

  const filteredOptions = options.filter(
    (opt) => !selectedOptions.some((sel) => sel.value === opt.value)
  );

  return (
    <Command
      className={cn('overflow-visible bg-transparent', className)}
      shouldFilter={false}
    >
      <div
        className={cn(
          'group rounded-md border border-input px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'cursor-not-allowed bg-gray-100'
        )}
      >
        <div className='flex flex-wrap gap-1'>
          {selectedOptions.map((option) => (
            <Badge key={option.value} className={cn(badgeClassName)}>
              {option.label}
              <button
                className='ml-1 rounded-full focus:outline-none'
                onClick={() => handleUnselect(option)}
                disabled={disabled}
              >
                <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            disabled={disabled}
            onValueChange={(value) => {
              setInputValue(value);
            }}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            autoFocus={false}
            placeholder={placeholder}
            className='ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
          />
        </div>
      </div>
      <div className='relative mt-2'>
        {open && (
          <CommandList className='absolute top-0 z-10 max-h-40 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
            {filteredOptions.length > 0 ? (
              <>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleSelect(option);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={cn('cursor-pointer')}
                  >
                    {option.label}
                  </CommandItem>
                ))}
                <div ref={loadMoreRef}>
                  {isFetchingNextPage && <div>Loading more...</div>}
                </div>
              </>
            ) : (
              <div className='p-2 text-sm text-muted-foreground'>
                Sonuç bulunamadı.
              </div>
            )}
          </CommandList>
        )}
      </div>
    </Command>
  );
}

const MultipleSelectFromApiForwardRef = React.forwardRef(
  MultipleSelectFromApi
) as <T extends Record<string, any>>(
  props: MultipleSelectFromApiProps<T> & {
    ref?: React.Ref<MultipleSelectFromApiRef>;
  }
) => React.ReactElement;

export default MultipleSelectFromApiForwardRef;
//////////////////

// import React, {
//   forwardRef,
//   useEffect,
//   useImperativeHandle,
//   useRef,
//   useState,
// } from 'react';
// import { X } from 'lucide-react';
// import { Command, CommandItem, CommandList } from '@/components/ui/command';
// import { Command as CommandPrimitive } from 'cmdk';
// import { useInfiniteQuery } from '@tanstack/react-query';
// import { useInView } from 'react-intersection-observer';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { useDebounce } from '@/lib/debounce';
// import {
//   useFloating,
//   offset,
//   flip,
//   shift,
//   autoUpdate,
// } from '@floating-ui/react';
// import { Option } from '../data/option-type';

// interface SelectFromApiProps {
//   queryKey: string;
//   fetchOptions: (params: {
//     page?: number;
//     searchName?: string;
//     pageSize?: number;
//   }) => Promise<Option[]>;
//   pageSize?: number;
//   value?: string | string[];
//   defaultOptions?: Option[];
//   placeholder?: string;
//   onChange?: (selectedIds: string | string[] | null) => void;
//   disabled?: boolean;
//   className?: string;
//   badgeClassName?: string;
//   dialogOpen?: boolean;
//   multiple?: boolean;
// }

// export interface SelectFromApiRef {
//   selectedIds: string[];
//   input: HTMLInputElement | null;
// }

// const SelectFromApi = forwardRef<SelectFromApiRef, SelectFromApiProps>(
//   (
//     {
//       queryKey,
//       fetchOptions,
//       pageSize = 10,
//       value,
//       defaultOptions = [],
//       placeholder,
//       onChange,
//       disabled,
//       className,
//       badgeClassName,
//       dialogOpen,
//       multiple = false,
//     },
//     ref
//   ) => {
//     const inputRef = useRef<HTMLInputElement>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [open, setOpen] = useState(false);
//     const [inputValue, setInputValue] = useState('');
//     const [options, setOptions] = useState<(Option | undefined)[] | undefined>(
//       []
//     );
//     const [selectedOption, setSelectedOption] = useState<Option>();

//     const debouncedInputValue = useDebounce(inputValue, 500);

//     const {
//       data,
//       fetchNextPage,
//       hasNextPage,
//       isFetchingNextPage,
//       refetch,
//       isLoading,
//     } = useInfiniteQuery({
//       queryKey: [queryKey, debouncedInputValue],
//       queryFn: async ({ pageParam = 1 }) => {
//         const data = await fetchOptions({
//           page: pageParam,
//           searchName: debouncedInputValue,
//           pageSize,
//         });
//         return data;
//       },
//       getNextPageParam: (lastPage, allPages) => {
//         if (lastPage.length === pageSize) {
//           return allPages.length + 1;
//         } else {
//           return undefined;
//         }
//       },
//       initialPageParam: 1,
//       enabled: open,
//     });

//     const { ref: loadMoreRef, inView } = useInView();

//     useImperativeHandle(ref, () => ({
//       selectedIds: value ? (Array.isArray(value) ? value : [value]) : [],
//       input: inputRef.current,
//     }));

//     useEffect(() => {
//       if (inView && hasNextPage && !isFetchingNextPage) {
//         fetchNextPage();
//       }
//     }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

//     useEffect(() => {
//       const fetchedOptions = data ? data.pages.flatMap((page) => page) : [];

//       const allOptions =
//         selectedOption !== undefined
//           ? [...defaultOptions, ...fetchedOptions, selectedOption]
//           : [...fetchedOptions, ...defaultOptions];

//       // Aynı ID'ye sahip seçenekleri filtreliyoruz
//       const uniqueOptions = allOptions.reduce<Option[]>((acc, current) => {
//         if (!acc.find((item) => item.value === current.value)) {
//           acc.push(current);
//         }
//         return acc;
//       }, []);

//       setOptions(uniqueOptions);
//     }, [data, defaultOptions, selectedOption]);

//     const selectedIds = value ? (Array.isArray(value) ? value : [value]) : [];

//     const selectedOptions = options?.filter((opt) =>
//       selectedIds.includes(opt?.value ?? '')
//     );

//     const handleUnselect = (option?: Option) => {
//       if (disabled && !option) return;
//       if (multiple) {
//         const newIds = selectedIds.filter((id) => id !== option?.value);
//         onChange?.(newIds);
//       } else {
//         onChange?.(null);
//       }
//     };

//     const handleSelect = (option: Option) => {
//       if (disabled) return;
//       if (multiple) {
//         const exists = selectedIds.includes(option.value);
//         if (!exists) {
//           const newIds = [...selectedIds, option.value];
//           onChange?.(newIds);
//         }
//       } else {
//         onChange?.(option.value);
//         setSelectedOption(option);
//         setOpen(false);
//       }
//       setInputValue('');
//     };

//     const filteredOptions = options?.filter((opt) => {
//       return !selectedIds.includes(opt?.value ?? '');
//     });

//     const { refs, floatingStyles } = useFloating({
//       placement: 'bottom-start',
//       middleware: [offset(4), flip(), shift()],
//       whileElementsMounted: autoUpdate,
//     });

//     const setReferenceElement = refs.setReference;
//     const setFloatingElement = refs.setFloating;

//     useEffect(() => {
//       const handleClickOutside = (event: MouseEvent) => {
//         if (
//           containerRef.current &&
//           !containerRef.current.contains(event.target as Node) &&
//           refs.floating.current &&
//           !refs.floating.current.contains(event.target as Node)
//         ) {
//           setOpen(false);
//         }
//       };

//       if (open) {
//         document.addEventListener('mousedown', handleClickOutside);
//       } else {
//         document.removeEventListener('mousedown', handleClickOutside);
//       }

//       return () => {
//         document.removeEventListener('mousedown', handleClickOutside);
//       };
//     }, [open, refs.floating]);

//     return (
//       <Command shouldFilter={false}>
//         <div ref={containerRef}>
//           <div
//             ref={setReferenceElement}
//             className={cn(
//               'group rounded-md border border-input px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
//               disabled && 'cursor-not-allowed bg-gray-100',
//               selectedIds.length > 0 ? 'py-1.5 ring ring-primary' : ''
//             )}
//           >
//             <div className='flex flex-wrap gap-1'>
//               {selectedOptions?.map((option) => (
//                 <Badge key={option?.value} className={cn(badgeClassName)}>
//                   {option?.label}
//                   <button
//                     className='ml-1 rounded-full focus:outline-none'
//                     onClick={() => handleUnselect(option)}
//                     disabled={disabled}
//                   >
//                     <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
//                   </button>
//                 </Badge>
//               ))}
//               <CommandPrimitive.Input
//                 ref={inputRef}
//                 value={inputValue}
//                 disabled={disabled}
//                 onValueChange={(value) => {
//                   setInputValue(value);
//                 }}
//                 onBlur={() => setOpen(false)}
//                 onFocus={() => setOpen(true)}
//                 autoFocus={false}
//                 placeholder={placeholder}
//                 className='ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
//               />
//             </div>
//           </div>
//         </div>
//         {open && (
//           <div
//             ref={setFloatingElement}
//             style={{
//               zIndex: 9999,
//               width: refs.reference.current
//                 ? refs.reference.current.getBoundingClientRect().width
//                 : undefined,
//               ...floatingStyles,
//             }}
//           >
//             <CommandList className='max-h-40 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none'>
//               {filteredOptions && filteredOptions.length > 0 ? (
//                 <>
//                   {filteredOptions?.map((option) => (
//                     <CommandItem
//                       key={option?.value}
//                       value={option?.value}
//                       onSelect={() => {
//                         if (option) handleSelect(option);
//                       }}
//                       onMouseDown={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                       }}
//                       className={cn('cursor-pointer')}
//                     >
//                       {option?.label}
//                     </CommandItem>
//                   ))}
//                   <div ref={loadMoreRef}>
//                     {isFetchingNextPage && <div>Loading more...</div>}
//                   </div>
//                 </>
//               ) : isLoading ? (
//                 <div className='p-2 text-sm text-muted-foreground'>
//                   Yükleniyor...
//                 </div>
//               ) : (
//                 <div className='p-2 text-sm text-muted-foreground'>
//                   Sonuç bulunamadı.
//                 </div>
//               )}
//             </CommandList>
//           </div>
//         )}
//       </Command>
//     );
//   }
// );

// export default SelectFromApi;
