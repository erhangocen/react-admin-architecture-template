import { cn } from '@/lib/utils';
import {
  FormControl,
  FormLabel,
  FormMessage,
  FormItem as RadixFormItem,
} from '@/components/ui/form';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Button } from '../button';

interface FormSelectProps<T> {
  label: string;
  name: string;
  data: T[];
  value: string;
  onChange: (value: T) => void;
  placeholder?: string;
  displayField?: keyof T;
}

export function FormSelect<T extends { id: string; name: string }>({
  label,
  name,
  data,
  value,
  onChange,
  placeholder,
  displayField = 'name',
}: FormSelectProps<T>) {
  return (
    <RadixFormItem className='flex flex-col'>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant='outline'
              role='combobox'
              className={cn(
                'justify-between',
                !value && 'text-muted-foreground'
              )}
            >
              {value ? data?.find((x) => x.id === value)?.name : placeholder}
              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent align='start' className='p-0'>
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandList>
              {data?.map((item, i) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => onChange(item)}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      item.name === data.find((x) => x.id == value)?.name
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {item[displayField] as string}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </RadixFormItem>
  );
}
