import { errorMessages } from '@/data/language-datas/error-messages'
import { textDatas } from '@/data/language-datas/text-datas'
import {
  ErrorMessagesType,
  LanguagePreferences,
  TextDatasType,
} from '@/data/language-types'
import { ReactNode, createContext, useContext, useState } from 'react'

interface ILanguagePreferenceContext {
  languagePreference: LanguagePreferences
  changeLanguagePreference: (language: LanguagePreferences) => void
  getStaticTextDatasForPreference: () => TextDatasType
  getStaticErrorMessagesForPreference: () => ErrorMessagesType
}

interface LanguagePreferenceProviderProps {
  children: ReactNode
}

export const LanguagePreferenceContext =
  createContext<ILanguagePreferenceContext>({} as ILanguagePreferenceContext)

export const LanguagePreferenceProvider: React.FC<
  LanguagePreferenceProviderProps
> = ({ children }) => {
  const [languagePreference, setLanguagePreference] =
    useState<LanguagePreferences>(LanguagePreferences.EN)

  const changeLanguagePreference = (language: LanguagePreferences) => {
    setLanguagePreference(language)
  }

  const getStaticTextDatasForPreference = () => textDatas[languagePreference]
  const getStaticErrorMessagesForPreference = () =>
    errorMessages[languagePreference]

  return (
    <LanguagePreferenceContext.Provider
      value={{
        languagePreference,
        changeLanguagePreference,
        getStaticTextDatasForPreference,
        getStaticErrorMessagesForPreference,
      }}
    >
      {children}
    </LanguagePreferenceContext.Provider>
  )
}

export const useLanguagePreference = () => useContext(LanguagePreferenceContext)
