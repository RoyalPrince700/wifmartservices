# Loading Component

A reusable loading component with multiple variants for consistent loading states throughout the application.

## Features

- **Multiple Variants**: Spinner, Skeleton, Dots, Card Skeleton
- **Flexible Sizing**: xs, sm, md, lg, xl
- **Color Options**: blue, white, gray, green, purple
- **Full-screen Overlay**: Optional full-screen loading
- **Accessibility**: Includes proper ARIA labels and screen reader support

## Usage

### Basic Spinner
```jsx
import Loading from '../components/Loading';

<Loading />
```

### With Custom Props
```jsx
<Loading
  variant="spinner"
  size="lg"
  color="blue"
  text="Loading data..."
/>
```

### Skeleton Loading
```jsx
<Loading
  variant="skeleton"
  color="gray"
  text="Loading content..."
/>
```

### Centered Loading
```jsx
<Loading
  variant="centered"
  size="lg"
  color="blue"
  text="Please wait..."
/>
```

### Full Screen Loading
```jsx
<Loading
  variant="spinner"
  size="xl"
  color="blue"
  text="Loading application..."
  fullScreen={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'spinner'` | Loading style: `'spinner'`, `'skeleton'`, `'dots'`, `'card'`, `'centered'` |
| `size` | string | `'md'` | Size: `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'` |
| `color` | string | `'blue'` | Color theme: `'blue'`, `'white'`, `'gray'`, `'green'`, `'purple'` |
| `text` | string | `''` | Optional loading text |
| `fullScreen` | boolean | `false` | Whether to show full-screen overlay |
| `className` | string | `''` | Additional CSS classes |

## Examples in Codebase

### Page Loading
```jsx
// In Dashboard.jsx
if (loading) {
  return (
    <Loading
      variant="centered"
      size="lg"
      color="blue"
      text="Loading your dashboard..."
    />
  );
}
```

### Component Loading
```jsx
// In ProvidersSection.jsx
{loading ? (
  <Loading
    variant="skeleton"
    color="gray"
    text="Loading providers..."
  />
) : (
  // Content
)}
```

### Search Loading
```jsx
// In SearchResults.jsx
{loading && (
  <Loading
    variant="centered"
    size="lg"
    color="blue"
    text="Finding the best service providers for you..."
  />
)}
```

## Integration Guidelines

1. **Use consistently** across similar loading states
2. **Choose appropriate variants**:
   - `spinner` for general loading
   - `skeleton` for content placeholders
   - `centered` for page/section loading
   - `dots` for inline loading
3. **Match your theme** - use blue for primary actions, gray for secondary
4. **Provide context** with descriptive loading text
5. **Consider accessibility** - screen readers will announce "Loading..." automatically
