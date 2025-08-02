# Professional Internationalization (i18n) System

This document describes the professional internationalization system implemented in the Anjez platform, following industry best practices used by major companies.

## Features

### 🌍 Multi-Language Support
- **English (en)** - Left-to-Right (LTR)
- **Arabic (ar)** - Right-to-Left (RTL)

### 🎯 Professional Language Switching
- **Loading Overlay**: Full-screen overlay during language change
- **Smooth Transitions**: 500ms transition with proper loading states
- **Native Language Names**: Shows language names in their native script
- **Professional Notifications**: Toast notifications on language change
- **Persistent Storage**: Remembers user's language preference

### 📱 RTL Support
- **Complete Layout Reversal**: All components adapt to RTL
- **Proper Text Alignment**: Right-aligned text for Arabic
- **Icon Positioning**: Icons and buttons reposition correctly
- **Form Elements**: Input fields and forms adapt to RTL
- **Dropdown Positioning**: Dropdowns open in correct direction

## Architecture

### Core Components

1. **LanguageProvider** (`lib/language.jsx`)
   - Manages language state
   - Handles RTL/LTR switching
   - Provides loading overlay
   - Updates document attributes

2. **useLanguageChange Hook** (`lib/useLanguageChange.js`)
   - Professional API for language changes
   - Custom events for component communication
   - Error handling and validation

3. **LanguageDropdown** (`Components/LanguageDropdown.jsx`)
   - Professional dropdown with flags
   - Loading states and native names
   - RTL-aware positioning

4. **LanguageChangeNotification** (`Components/LanguageChangeNotification.jsx`)
   - Toast notifications on language change
   - Auto-dismiss after 3 seconds
   - Professional styling

### File Structure

```
resources/js/
├── lib/
│   ├── i18n.js                    # i18n configuration
│   ├── language.jsx               # Language context & provider
│   ├── useLanguageChange.js       # Language change hook
│   └── locales/
│       ├── en.json               # English translations
│       └── ar.json               # Arabic translations
├── Components/
│   ├── LanguageDropdown.jsx       # Language selector
│   └── LanguageChangeNotification.jsx # Change notifications
└── app.jsx                        # App initialization
```

## Usage

### Basic Language Switching

```jsx
import { useLanguageChange } from '@/lib/useLanguageChange';

function MyComponent() {
    const { switchLanguage, currentLanguage, isRTL } = useLanguageChange();
    
    return (
        <button onClick={() => switchLanguage('ar')}>
            Switch to Arabic
        </button>
    );
}
```

### Using Translations

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
    const { t } = useTranslation();
    
    return (
        <h1>{t('nav.services')}</h1>
    );
}
```

### RTL-Aware Components

```jsx
import { useLanguageChange } from '@/lib/useLanguageChange';

function MyComponent() {
    const { isRTL } = useLanguageChange();
    
    return (
        <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span>Content</span>
        </div>
    );
}
```

## Professional Features

### 1. Loading Overlay
- Full-screen overlay during language change
- Prevents user interaction during transition
- Professional spinner animation
- Backdrop blur effect

### 2. Smooth Transitions
- 300ms initial delay for overlay
- 200ms content update delay
- CSS transitions for all elements
- Proper state management

### 3. Error Handling
- Try-catch blocks for language changes
- Fallback to previous language on error
- Console warnings for missing translations
- Graceful degradation

### 4. Performance Optimizations
- Lazy loading of translation files
- Efficient state updates
- Minimal re-renders
- Optimized CSS for RTL

## CSS Classes for RTL

### Layout Classes
```css
.rtl { direction: rtl; text-align: right; }
.ltr { direction: ltr; text-align: left; }
```

### Spacing Utilities
```css
.rtl .space-x-2 { /* RTL spacing */ }
.rtl .ml-2 { margin-left: 0; margin-right: 0.5rem; }
.rtl .mr-2 { margin-right: 0; margin-left: 0.5rem; }
```

### Component Overrides
```css
.rtl .flex-row { flex-direction: row-reverse; }
.rtl .justify-start { justify-content: flex-end; }
.rtl input { text-align: right; }
```

## Best Practices

### 1. Translation Keys
- Use nested structure: `nav.services`, `forms.email`
- Keep keys descriptive and organized
- Use consistent naming conventions

### 2. RTL Considerations
- Always test both LTR and RTL layouts
- Use flexbox for responsive layouts
- Test with long text content
- Verify icon and button positioning

### 3. Performance
- Minimize translation file size
- Use lazy loading for large apps
- Cache translations in localStorage
- Optimize bundle splitting

### 4. User Experience
- Show loading states during changes
- Provide visual feedback
- Maintain scroll position
- Preserve form data

## Adding New Languages

1. **Add Language Configuration**
```jsx
// In language.jsx
const languages = [
    // ... existing languages
    { 
        code: 'fr', 
        name: 'French', 
        nativeName: 'Français',
        flag: '🇫🇷',
        direction: 'ltr'
    }
];
```

2. **Create Translation File**
```json
// locales/fr.json
{
    "nav": {
        "services": "Services",
        "about": "À propos"
    }
}
```

3. **Update i18n Configuration**
```jsx
// In i18n.js
const resources = {
    // ... existing resources
    fr: {
        translation: frTranslations
    }
};
```

## Testing

### Manual Testing Checklist
- [ ] Language switching works
- [ ] RTL layout displays correctly
- [ ] Loading overlay appears
- [ ] Notifications show properly
- [ ] Form elements align correctly
- [ ] Icons and buttons position properly
- [ ] Scroll behavior is maintained
- [ ] Performance is acceptable

### Automated Testing
```jsx
// Example test
test('language switching updates document direction', () => {
    render(<LanguageProvider><TestComponent /></LanguageProvider>);
    
    fireEvent.click(screen.getByText('العربية'));
    
    expect(document.documentElement.dir).toBe('rtl');
});
```

## Troubleshooting

### Common Issues

1. **RTL Layout Not Working**
   - Check CSS classes are applied
   - Verify document attributes are set
   - Ensure components use RTL-aware classes

2. **Translations Not Loading**
   - Check file paths and imports
   - Verify translation keys exist
   - Check browser console for errors

3. **Performance Issues**
   - Optimize translation file size
   - Use lazy loading for large apps
   - Check for unnecessary re-renders

### Debug Mode
Enable debug mode in `i18n.js`:
```jsx
debug: true
```

This will log translation loading and missing keys to the console.

## Future Enhancements

- [ ] Server-side language detection
- [ ] Dynamic translation loading
- [ ] Pluralization support
- [ ] Date and number formatting
- [ ] Currency formatting
- [ ] Accessibility improvements
- [ ] SEO optimization for multiple languages 