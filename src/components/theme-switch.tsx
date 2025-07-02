import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from './theme-provider'
import { Button } from './custom/button'
import { useEffect } from 'react'
import { useLanguagePreference } from '@/hooks/use-language-preference'
import { LanguagePreferences } from '@/data/language-types'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    metaThemeColor && metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  const { languagePreference, changeLanguagePreference } =
    useLanguagePreference()

  return (
    <Button
      size='icon'
      variant='ghost'
      className='rounded-full'
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light')
        changeLanguagePreference(
          languagePreference === LanguagePreferences.TR
            ? LanguagePreferences.EN
            : LanguagePreferences.TR
        )
      }}
    >
      {theme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
    </Button>
  )
}
