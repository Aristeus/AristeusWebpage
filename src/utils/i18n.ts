import esData from '../data/es.json';
import enData from '../data/en.json';

export type Language = 'es' | 'en';
export type I18nData = typeof esData;

const translations: Record<Language, I18nData> = {
  es: esData,
  en: enData,
};

const STORAGE_KEY = 'aristeus-language';
const DEFAULT_LANG: Language = 'es';

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  return stored && (stored === 'es' || stored === 'en') ? stored : DEFAULT_LANG;
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

export function getTranslations(lang: Language): I18nData {
  return translations[lang];
}

export function toggleLanguage(): Language {
  const current = getStoredLanguage();
  const next: Language = current === 'es' ? 'en' : 'es';
  setStoredLanguage(next);
  return next;
}

export function updatePageContent(lang: Language): void {
  if (typeof window === 'undefined') return;
  
  const data = getTranslations(lang);
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    
    const value = getNestedValue(data, key);
    if (value !== undefined) {
      if (el.hasAttribute('placeholder')) {
        el.setAttribute('placeholder', String(value));
      } else {
        el.textContent = String(value);
      }
    }
  });
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function formatNumber(num: number, lang: Language): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-BO' : 'en-US').format(num);
}

export function formatCurrency(amount: number, lang: Language): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-BO' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}
