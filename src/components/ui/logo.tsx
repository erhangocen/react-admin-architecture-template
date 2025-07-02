import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme-provider';

export default function Logo({
  light = true,
  size = { height: 23, width: 169 },
  link = false,
}: {
  light?: boolean;
  size?: { width: number; height: number };
  link?: boolean;
}) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return light === true && theme === 'light' ? (
    <div>shadcn/ui</div>
  ) : (
    <div>shadcn/ui</div>
  );
}
