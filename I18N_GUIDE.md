# Multi-Language Translation System

Your Kader Project now supports **10 languages** with an easy-to-use translation system!

## Supported Languages 🌍

- 🇺🇸 **English** (en)
- 🇸🇦 **العربية** - Arabic (ar) - RTL Support
- 🇪🇸 **Español** - Spanish (es)
- 🇫🇷 **Français** - French (fr)
- 🇩🇪 **Deutsch** - German (de)
- 🇮🇹 **Italiano** - Italian (it)
- 🇵🇹 **Português** - Portuguese (pt)
- 🇨🇳 **中文** - Chinese (zh)
- 🇯🇵 **日本語** - Japanese (ja)
- 🇰🇷 **한국어** - Korean (ko)

## Features

✅ **Language Switcher** - Dropdown menu in navbar (desktop) + grid selector (mobile)
✅ **Auto-Detection** - Detects user's browser language on first visit
✅ **Persistent Storage** - User's language choice saved in localStorage
✅ **RTL Support** - Automatic RTL layout for Arabic
✅ **10 Languages** - 150+ translation keys per language
✅ **Easy Integration** - Simple `useLanguage()` hook for any component

## Usage in Components

### Basic Translation

```tsx
import { useLanguage } from '../i18n/LanguageContext';

export const MyComponent = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('nav.dashboard')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
};
```

### Get Current Language or Change Language

```tsx
import { useLanguage } from '../i18n/LanguageContext';

export const LanguageSettings = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  return (
    <div>
      <p>Current: {language}</p>
      {availableLanguages.map(lang => (
        <button onClick={() => setLanguage(lang.code)}>
          {lang.flag} {lang.name}
        </button>
      ))}
    </div>
  );
};
```

## Adding New Translations

### 1. Edit `i18n/translations.ts`

Add your translation key and text to each language:

```tsx
export const translations: Record<Language, Record<string, string>> = {
  en: {
    'my.new.key': 'My new text',
    ...
  },
  ar: {
    'my.new.key': 'نصي الجديد',
    ...
  },
  // ... other languages
};
```

### 2. Use in Component

```tsx
const { t } = useLanguage();
<div>{t('my.new.key')}</div>
```

## Translation Keys Structure

Keys are organized by feature (namespace):

- **nav.*** - Navigation items (Login, Register, Dashboard, etc.)
- **home.*** - Homepage content (titles, banners)
- **cart.*** - Shopping cart UI (Total, Quantity, Checkout, etc.)
- **store.*** - Product store (Filter, Sort, Add to Cart)
- **auth.*** - Authentication pages (Email, Password, Error messages)
- **dashboard.*** - User dashboard
- **admin.*** - Admin panel
- **community.*** - Community features
- **support.*** - Support/Help section
- **contact.*** - Contact form
- **common.*** - Common UI elements (Save, Cancel, Loading, etc.)

## How It Works

1. **LanguageProvider** (App.tsx wrapper)
   - Wraps your entire app with translation context
   - Manages language state and localStorage

2. **useLanguage()** Hook
   - Access current language
   - Translate text with `t()`
   - Change language with `setLanguage()`
   - List available languages

3. **Auto-Detection**
   - Checks localStorage for saved language
   - Falls back to browser language
   - Defaults to English if unavailable

4. **RTL Support**
   - Automatically sets `dir="rtl"` for Arabic
   - Update component CSS with flexbox for RTL compatibility

## Navbar Language Switcher

### Desktop
- Dropdown menu in top-right with all 10 languages
- Shows flag emoji and language name
- Click to change immediately

### Mobile
- Grid layout with 5 columns (all flags visible)
- Tap to switch language
- Mobile menu closes after selection

## Browser Support

- Automatically detects browser language on first visit
- Saves selection in localStorage
- Works offline after first load

## Example Translation Keys Available

```
Navigation:
- nav.login / nav.register / nav.logout
- nav.dashboard / nav.store / nav.hub
- nav.admin / nav.medical / nav.sos
- nav.community / nav.support / nav.contact

Homepage:
- home.title / home.subtitle
- home.banner1 / home.banner2 / home.banner3 / home.banner4

Shopping:
- cart.title / cart.empty / cart.total
- store.title / store.addToCart / store.price

Common:
- common.loading / common.error / common.success
- common.save / common.cancel / common.delete
```

## Best Practices

1. **Always use translation keys** instead of hardcoding text
2. **Group related keys** with the same prefix (e.g., `cart.*`)
3. **Use meaningful key names** that describe the content
4. **Add translations for all 10 languages** when adding features
5. **Test with RTL language** (Arabic) to check layout

## Current Translation Coverage

✅ All navbar items
✅ Homepage content
✅ Shopping cart UI
✅ Product store
✅ Authentication forms
✅ Dashboard pages
✅ Admin panel
✅ Community features
✅ Support tickets
✅ Contact forms
✅ Common UI elements

---

**Build Time**: 4.93s ✅
**Total Languages**: 10 🌍
**Translation Keys**: 150+ per language
