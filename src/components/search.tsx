import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { IconSearch } from '@tabler/icons-react';
import * as React from 'react';
import { Badge } from './ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from './ui/command';
import SearchIcon from './ui/searchIcon';

export function Search() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  React.useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='flex cursor-pointer flex-row items-center gap-2 rounded-md border px-1 py-1 md:w-[100px] lg:w-[300px]'>
          <div className='p-1 pl-1.5 text-muted-foreground'>
            <IconSearch size={18} />
          </div>
          <div className='flex w-full select-none flex-row items-center justify-between text-sm text-muted-foreground'>
            <div>Arama</div>
            <p className='text-sm text-muted-foreground'>
              <kbd className='r pointer-events-none inline-flex h-5 select-none items-center gap-1 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
                <span className='text-xs'>⌘</span>
                <div>K</div>
              </kbd>
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className='fixed inset-0 bg-white bg-opacity-0 backdrop-blur-sm' />
        <DialogContent
          className='motion-preset-blur-down-md w-full max-w-4xl gap-6 border-transparent bg-transparent p-1 shadow-none'
          style={{
            position: 'fixed',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            maxHeight: '70vh', // Maksimum yükseklik
            overflowY: 'auto', // Dikey kaydırma
          }}
          withoutCloseIcon
        >
          <div className='flex justify-center'>
            <form onSubmit={handleSearch} className='relative w-full'>
              <Input
                type='search'
                placeholder='Search...'
                className='h-14 w-full rounded-xl bg-background p-8 py-7 pl-12 pr-10 text-xl'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <SearchIcon />
            </form>{' '}
          </div>
          <div className='flex flex-row gap-3'>
            <Command className='h-max w-1/5'>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem onSelect={(e) => console.log(e)}>
                    <div className='flex w-full flex-row items-center justify-between'>
                      <div>All</div>
                      <div>
                        <Badge>56</Badge>
                      </div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <div className='flex w-full flex-row items-center justify-between'>
                      <div>Doc</div>
                      <div>
                        <Badge>16</Badge>
                      </div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <div className='flex w-full flex-row items-center justify-between'>
                      <div>Blog</div>
                      <div>
                        <Badge>12</Badge>
                      </div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <div className='flex w-full flex-row items-center justify-between'>
                      <div>Site</div>
                      <div>
                        <Badge>23</Badge>
                      </div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <div className='flex w-full flex-row items-center justify-between'>
                      <div>Resources</div>
                      <div>
                        <Badge>5</Badge>
                      </div>
                    </div>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
            <Command className='w-4/5'>
              <CommandList className='max-h-96'>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem>
                    <div className='flex flex-col gap-1 p-2'>
                      <div className='text-base font-semibold'>
                        Portal Design
                      </div>
                      <div className='text-sm font-light'>
                        Karşılama ekranlarınızı kolayca tasarlyın, Lokasyona
                        özel tasarımlarınızı yapabilirsiniz ve renk temanızı...
                      </div>
                      <div className='font- text-xs'>
                        Uygulamalar {'>'} Portal Design
                      </div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <div className='flex flex-col gap-1 p-2'>
                      <div className='text-base font-semibold'>
                        Müşterileriniz için anket oluştururken anketinizi
                        tasarlayabilir ve kişiselleştirebilirsiniz...
                      </div>
                      <div className='text-sm font-light'>
                        ... Özel Düzenlemeler Yapın ve Renk Temanızı
                        Düzenlemeler Yapın ve Renk Temanızı Düzenleyin{' '}
                      </div>
                      <div className='font- text-xs'>
                        {`Uygulamalar ${'>'} Anket Soru ${'>'} Tasarımı`}
                      </div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <div className='flex flex-col gap-1 p-2'>
                      <div className='text-base font-semibold'>
                        Uygulama Design{' '}
                      </div>
                      <div className='text-sm font-light'>
                        Karşılama Ekranlarınızı Kolayca Tasarlayın, Lokasyona
                        Özel Düzenlemeler Yapın ve Renk Temanızı...
                      </div>
                      <div className='font- text-xs'>
                        {`Uygulamalar ${'>'} Portal Design`}
                      </div>
                    </div>
                  </CommandItem>
                  <CommandItem>
                    <div className='flex flex-col gap-1 p-2'>
                      <div className='text-base font-semibold'>
                        Panel Design{' '}
                      </div>
                      <div className='text-sm font-light'>
                        Karşılama Ekranlarınızı Kolayca Tasarlayın, Lokasyona
                        Özel Düzenlemeler Yapın ve Renk Temanızı...
                      </div>
                      <div className='font- text-xs'>
                        {`Uygulamalar ${'>'} Portal Design`}
                      </div>
                    </div>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
