import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HeaderSubtitleItemType } from '@/lib/dashboard-utils'
import { IconSettings } from '@tabler/icons-react'
import { FC } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  items: HeaderSubtitleItemType[]
}

export const SettingsMenu: FC<Props> = ({ items }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost' className='rounded-full'>
          <IconSettings size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-max max-w-56' align='center' forceMount>
        <DropdownMenuGroup>
          {items.map((item, index) => (
            <Link to={item.link} key={index}>
              <DropdownMenuItem>{item.title}</DropdownMenuItem>
            </Link>
          ))}
          {/* <Link to={'/admin/user_management'}>
            <DropdownMenuItem>Kullanıcı Yönetimi</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
