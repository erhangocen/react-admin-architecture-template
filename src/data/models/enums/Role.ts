// options.ts
import { useLanguagePreference } from '@/hooks/use-language-preference'

export function useRoleOptions() {
  const { getStaticTextDatasForPreference } = useLanguagePreference()

  const options = [
    {
      value: "Admin",
      label: getStaticTextDatasForPreference().admin,
    },
    {
      value: "LocalAdmin",
      label: getStaticTextDatasForPreference().localAdmin,
    },
    {
      value: "Reseller",
      label: getStaticTextDatasForPreference().reseller,
    },
  ]

  return options
}
