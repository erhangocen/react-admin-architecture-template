import * as React from 'react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { IconChevronDown, IconMapPin } from '@tabler/icons-react';

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  children:
    | React.ReactElement<typeof BreadcrumbItem>
    | React.ReactElement<typeof BreadcrumbItem>[];
  separator?: React.ReactNode;
}

const BreadcrumbContext = React.createContext<boolean>(false);

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, children, separator, ...props }, ref) => {
    const validChildren = getValidChildren(children);

    const count = validChildren.length;

    const clones = validChildren.map((child, index) =>
      React.cloneElement(child, {
        separator,
        isLastChild: count === index + 1,
      })
    );

    return (
      <BreadcrumbContext.Provider value={true}>
        <nav ref={ref} aria-label='breadcrumb' className={className} {...props}>
          <ol className={cn(`flex`)}>{clones}</ol>
        </nav>
      </BreadcrumbContext.Provider>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

interface InternalBreadcrumbItemProps {
  separator?: React.ReactNode;
  isLastChild: boolean;
}

interface BreadcrumbItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<'li'>,
    keyof InternalBreadcrumbItemProps
  > {}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, children, ...props }, ref) => {
    const { separator, isLastChild, ...rest } =
      props as InternalBreadcrumbItemProps;

    // Check if BreadcrumbItem is used within Breadcrumb
    const isInsideBreadcrumb = React.useContext(BreadcrumbContext);
    if (!isInsideBreadcrumb) {
      throw new Error(
        `${BreadcrumbItem.displayName} must be used within ${Breadcrumb.displayName}.`
      );
    }

    return (
      <li ref={ref} className={cn(`group`, className)} {...rest}>
        {children}
        {!isLastChild && (
          <span className='mx-2 *:!inline-block'>{separator ?? '/'}</span>
        )}
      </li>
    );
  }
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

interface BreadCrumbWithDataProps {
  items: BreadcrumbLink[];
  separator?: React.ReactNode;
}

export const BreadCrumbWithData: React.FC<BreadCrumbWithDataProps> = ({
  items,
  separator,
}) => {
  const [open, setOpen] = React.useState<boolean>();
  const navigate = useNavigate();
  return (
    <Breadcrumb separator={separator}>
      {items.map(({ link, title, children }, index1) =>
        children ? (
          <BreadcrumbItem key={index1}>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger
                onClick={() => setOpen(true)}
                className='flex items-center gap-1'
              >
                <span className=''>{title}</span>
                <IconChevronDown size={18} />
                <span className='sr-only'>Toggle menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='space-y-1'>
                {children.map(({ link, title, isActive, icon, iconSide }, index2) =>
                  link ? (
                    <DropdownMenuItem
                      onClick={() => {
                        navigate(link);
                        setOpen(false);
                      }}
                      disabled={isActive}
                      className={`${isActive ? 'bg-slate-300' : ''} cursor-pointer`}
                      key={index2}
                    >
                      {icon && iconSide == 'left' && (
                        <span className='pr-2'>
                          {icon}
                        </span>
                      )}

                      {title}
                      {icon && iconSide == 'left' && (
                        <span className='pr-2'>
                          {icon}
                        </span>
                      )}
                    </DropdownMenuItem>
                  ) : (
                   title
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={title}>
            {link ? (
              <Link to={link}>{title}</Link>
            ) : (
              <span className='text-muted-foreground'>{title}</span>
            )}
          </BreadcrumbItem>
        )
        )}
    </Breadcrumb>
  )
}

/* ========== Util Func ========== */

const getValidChildren = (children: React.ReactNode) =>
  React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child) && child.type === BreadcrumbItem) {
      return React.isValidElement(child);
    }
    throw new Error(
      `${Breadcrumb.displayName} can only have ${BreadcrumbItem.displayName} as children.`
    );
  }) as React.ReactElement[];

export { Breadcrumb, BreadcrumbItem };

export interface BreadcrumbLink {
  link?: string;
  title: string;
  isActive?: boolean;
  children?: BreadcrumbLink[];
  icon?: React.ReactNode;
  iconSide?: 'left' | 'right';
}
