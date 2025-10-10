# Mobile Responsive Design

This document outlines the responsive design features implemented to ensure the calculator works seamlessly on all screen sizes.

## Breakpoints

We use Tailwind CSS default breakpoints:

- **Mobile**: < 640px (no prefix)
- **Small (sm)**: ≥ 640px
- **Large (lg)**: ≥ 1024px

## Responsive Features

### 1. Typography

| Element         | Mobile               | Desktop                           |
| --------------- | -------------------- | --------------------------------- |
| Main Title      | `text-2xl` (1.5rem)  | `text-3xl` → `text-4xl` (2.25rem) |
| Section Headers | `text-xl` (1.25rem)  | `text-2xl` (1.5rem)               |
| Labels          | `text-sm` (0.875rem) | `text-base` (1rem)                |
| Help Text       | `text-xs` (0.75rem)  | `text-sm` (0.875rem)              |
| Decision Badge  | `text-4xl` (2.25rem) | `text-6xl` (3.75rem)              |

### 2. Spacing

- **Padding**: Reduced from `py-8 px-4` to `py-4 px-3` on mobile
- **Margins**: Cards use `mb-6` on mobile vs `mb-8` on desktop
- **Card Body**: `p-4` on mobile vs `p-6` on desktop
- **Form Spacing**: `space-y-4` on mobile vs `space-y-6` on desktop

### 3. Form Inputs

**Join Groups** (Input + Select):

```html
<div class="join w-full flex-col sm:flex-row">
  <input class="...  w-full sm:w-auto" />
  <select class="... w-full sm:w-auto mt-2 sm:mt-0" />
</div>
```

On mobile:

- Stacks vertically (`flex-col`)
- Full width inputs
- 2rem margin between input and select

On desktop:

- Horizontal layout (`flex-row`)
- Auto-sized based on content
- No vertical margin

### 4. Tables

```html
<div class="overflow-x-auto -mx-4 sm:mx-0">
  <table class="table table-zebra text-sm sm:text-base"></table>
</div>
```

- Allows horizontal scrolling on mobile if needed
- Extends into padding area on mobile (`-mx-4`)
- Smaller font size on mobile

### 5. Touch Targets

All interactive elements meet or exceed **44x44px** minimum size:

- Buttons: `btn-lg` with `min-h-[3rem]` (48px height)
- Inputs: Default daisyUI size meets requirements
- Select dropdowns: Full width on mobile for easier tapping

### 6. Footer

```html
<span class="hidden sm:inline">|</span> <span class="block sm:inline mt-1 sm:mt-0"></span>
```

- Separators hidden on mobile
- Links stack vertically on mobile
- Links inline on desktop

## Testing

### Desktop (1920x1080)

- ✅ Full content width (max 896px)
- ✅ Large, readable text
- ✅ Comfortable spacing
- ✅ No horizontal scroll

### Tablet (768x1024)

- ✅ Responsive layout adapts
- ✅ Readable text sizes
- ✅ Easy-to-tap targets
- ✅ No horizontal scroll

### Mobile (375x667 - iPhone SE)

- ✅ Content fits screen width
- ✅ No zooming required
- ✅ Readable text
- ✅ Easy form filling
- ✅ No horizontal scroll
- ✅ Touch targets ≥ 44px

### Mobile Large (414x896 - iPhone 11)

- ✅ Optimal layout
- ✅ Perfect readability
- ✅ Comfortable spacing

## CSS Classes Used

### Responsive Padding/Margin

- `py-4 sm:py-8` - Vertical padding
- `px-3 sm:px-4` - Horizontal padding
- `mb-6 sm:mb-8` - Bottom margin
- `mt-2 sm:mt-0` - Conditional top margin

### Responsive Text

- `text-xs sm:text-sm` - Small text
- `text-sm sm:text-base` - Body text
- `text-xl sm:text-2xl` - Headers
- `text-2xl sm:text-3xl lg:text-4xl` - Main title

### Responsive Layout

- `flex-col sm:flex-row` - Vertical to horizontal
- `w-full sm:w-auto` - Full width to auto
- `hidden sm:inline` - Hide on mobile
- `block sm:inline` - Stack to inline

### Responsive Spacing

- `space-y-4 sm:space-y-6` - Vertical spacing between children
- `p-4 sm:p-6` - Padding
- `-mx-4 sm:mx-0` - Negative margin on mobile

## Best Practices Applied

1. **Mobile-First Approach**: Base styles for mobile, enhanced for desktop
2. **Touch-Friendly**: All targets ≥ 44px
3. **Readable Text**: Minimum 12px font size
4. **No Horizontal Scroll**: Content fits viewport
5. **Progressive Enhancement**: Works without JavaScript
6. **Accessibility**: Proper semantic HTML and ARIA labels
7. **Performance**: Minimal CSS overhead

## Browser Compatibility

Tested and working on:

- ✅ Chrome 90+ (Mobile & Desktop)
- ✅ Firefox 88+ (Mobile & Desktop)
- ✅ Safari 14+ (iOS & macOS)
- ✅ Edge 90+

## Lighthouse Scores (Target)

- **Mobile**:
  - Performance: ≥ 90
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100

- **Desktop**:
  - Performance: ≥ 95
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
