# Nihongo Sekai Theme & Layout System Examples

## Theme Usage

### Colors

```tsx
// Using theme colors in components
import { theme } from "@/styles/theme";

const MyComponent = () => (
  <div style={{ backgroundColor: theme.colors.primary[600] }}>
    Primary background
  </div>
);

// Or with Tailwind classes
<div className="bg-nihongo-crimson-600 text-white">Crimson background</div>;
```

### Typography

```tsx
// Font families
<h1 className="font-heading">Heading with Poppins</h1>
<p className="font-primary">Body text with Inter</p>

// Font sizes
<h1 className="text-4xl lg:text-6xl">Responsive heading</h1>
<p className="text-base lg:text-lg">Responsive body text</p>
```

## Layout Components

### PageContainer

```tsx
import { PageContainer } from "@/components/layout/LayoutSystem";

<PageContainer maxWidth="xl" padding="base">
  <h1>Page Content</h1>
</PageContainer>;
```

### Grid System

```tsx
import { Grid, GridItem } from '@/components/layout/LayoutSystem';

// Responsive grid
<Grid
  cols={{
    mobile: 1,
    tablet: 2,
    desktop: 4
  }}
  gap="base"
>
  <GridItem>Item 1</GridItem>
  <GridItem>Item 2</GridItem>
  <GridItem>Item 3</GridItem>
  <GridItem>Item 4</GridItem>
</Grid>

// Grid with custom spans
<Grid cols={{ desktop: 12 }}>
  <GridItem span={{ desktop: 8 }}>
    Main content (8/12)
  </GridItem>
  <GridItem span={{ desktop: 4 }}>
    Sidebar (4/12)
  </GridItem>
</Grid>
```

### Section Component

```tsx
import { Section } from "@/components/layout/LayoutSystem";

<Section spacing="lg" background="primary">
  <h2>Section Title</h2>
  <p>Section content</p>
</Section>;
```

### Stack Component

```tsx
import { Stack } from '@/components/layout/LayoutSystem';

// Vertical stack
<Stack direction="column" gap="lg" align="center">
  <h2>Title</h2>
  <p>Description</p>
  <Button>Action</Button>
</Stack>

// Horizontal stack
<Stack direction="row" gap="base" justify="between">
  <span>Left content</span>
  <span>Right content</span>
</Stack>
```

## Button Variants

```tsx
import { Button } from '@/components/ui/Button';

// Primary variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>

// Semantic variants
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="destructive">Delete</Button>
<Button variant="gold">Premium</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="base">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With icons
<Button leftIcon={<PlusIcon />}>Add Item</Button>
<Button rightIcon={<ArrowRightIcon />}>Continue</Button>

// Loading state
<Button loading loadingText="Saving...">Save</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

## Responsive Hooks

```tsx
import {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useBreakpoint,
  useResponsiveValue,
  useResponsiveColumns,
} from "@/hooks/useResponsive";

const MyComponent = () => {
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();

  const columns = useResponsiveColumns(1, 2, 4); // mobile, tablet, desktop

  const fontSize = useResponsiveValue({
    mobile: "14px",
    tablet: "16px",
    desktop: "18px",
  });

  return (
    <div style={{ fontSize }}>{isMobile ? "Mobile View" : "Desktop View"}</div>
  );
};
```

## Utility Classes

```tsx
// Container utilities
<div className="container-xl px-safe">
  Content with safe padding
</div>

// Grid utilities
<div className="grid grid-1 md:grid-2 lg:grid-4 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

// Background gradients
<div className="bg-gradient-nihongo">Nihongo gradient</div>
<div className="bg-gradient-crimson">Crimson gradient</div>
<div className="bg-gradient-sakura">Sakura gradient</div>

// Glass morphism
<div className="glass">Glass effect</div>

// Text utilities
<p className="text-balance">Balanced text</p>
<p className="line-clamp-3">Text with 3 line clamp</p>

// Focus utilities
<button className="focus-ring">Accessible focus</button>

// Animations
<div className="animate-fade-in">Fade in animation</div>
<div className="animate-slide-up">Slide up animation</div>
```

## Responsive Design Patterns

### Mobile-First Grid

```tsx
// Start with 1 column on mobile, expand on larger screens
<Grid cols={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}>
  {items.map((item) => (
    <GridItem key={item.id}>
      <Card>{item.content}</Card>
    </GridItem>
  ))}
</Grid>
```

### Adaptive Navigation

```tsx
const Navigation = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileNavigation />;
  }

  return <DesktopNavigation />;
};
```

### Responsive Typography

```tsx
<h1 className="text-2xl md:text-4xl lg:text-6xl font-heading">
  Responsive Heading
</h1>

<p className="text-sm md:text-base lg:text-lg">
  Responsive body text
</p>
```

### Responsive Spacing

```tsx
<Section spacing="sm" className="md:py-16 lg:py-20">
  Content with responsive spacing
</Section>

<Stack gap="sm" className="md:gap-6 lg:gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

## Accessibility Features

```tsx
// Screen reader only content
<span className="sr-only">
  This content is only for screen readers
</span>

// Focus management
<button className="focus-ring-primary">
  Accessible button with custom focus ring
</button>

// Reduced motion respect
<div className="motion-safe:animate-fade-in">
  Only animates if user allows motion
</div>
```

## Dark Mode Support

```tsx
// Theme-aware colors
<div className="bg-white dark:bg-nihongo-ink-900">Adapts to dark mode</div>;

// Using the preference hook
const MyComponent = () => {
  const prefersDark = usePrefersDarkMode();

  return (
    <div className={prefersDark ? "dark-theme" : "light-theme"}>
      Theme-aware content
    </div>
  );
};
```
