# Chart Color Tokens

## Overview

Blade's chart components use a sophisticated color theming system that automatically assigns colors to data series based on chart type, data indicators, and predefined color sequences. The system provides consistent, accessible colors across all chart types with automatic color assignment and different intensity levels for optimal visual hierarchy.

## Color System Architecture

### Color Categories

Blade supports 9 color categories for charts:

- **blue** - Primary blue
- **green** - Success/positive green  
- **red** - Error/negative red
- **orange** - Warning orange
- **skyBlue** - Light blue variant
- **purple** - Purple accent
- **pink** - Pink accent
- **gold** - Gold/yellow accent
- **gray** - Neutral gray

### Color Intensities

Each color category supports 5 intensity levels:

- **faint** - Lightest intensity
- **subtle** - Light intensity  
- **moderate** - Medium intensity
- **intense** - High intensity
- **strong** - Highest intensity

## Color Sequences

### Base Color Sequence

The primary color sequence used across all charts (in priority order):

1. blue
2. green
3. gold
4. purple
5. orange
6. pink
7. skyBlue
8. red
9. gray

### Intensity Sequences by Chart Type

**Bar Charts & Donut Charts:**
- Default sequence: faint → strong
- `['faint', 'subtle', 'moderate', 'intense', 'strong']`

**Line Charts & Area Charts:**
- Reverse sequence: strong → faint
- `['strong', 'intense', 'moderate', 'subtle', 'faint']`

## Color Token Format

All chart colors follow this token format:

```
data.background.categorical.{colorName}.{intensity}
```

**Examples:**
- `data.background.categorical.blue.faint`
- `data.background.categorical.green.strong`  
- `data.background.categorical.purple.moderate`

## Special Cases

### Single Data Point
When a chart has only one data indicator (except donut charts), it automatically uses:
```
data.background.categorical.gray.moderate
```

### Donut Charts
Donut charts follow the same color sequence but use different intensity mapping logic for optimal visual distinction between segments.

## Color Generation Algorithm

1. For each intensity level in the sequence
2. For each color in the color sequence  
3. Generate a color token in the format: `data.background.categorical.{colorName}.{intensity}`

This creates a comprehensive palette ensuring:
- Consistent color assignment across chart types
- Optimal contrast and accessibility
- Visual hierarchy through intensity variations

## Usage Examples

### Basic Chart with Automatic Colors

```tsx
import { ChartBarWrapper, ChartBar, ChartXAxis, ChartYAxis } from '@razorpay/blade/components';

function MyChart() {
  const data = [
    { name: 'Jan', sales: 4000, profit: 2400 },
    { name: 'Feb', sales: 3000, profit: 1398 },
    { name: 'Mar', sales: 2000, profit: 9800 },
  ];

  return (
    <ChartBarWrapper data={data}>
      <ChartXAxis dataKey="name" />
      <ChartYAxis />
      <ChartBar dataKey="sales" name="Sales" />
      <ChartBar dataKey="profit" name="Profit" />
    </ChartBarWrapper>
  );
}
```

### Explicit Color Theme

```jsx
<ChartBarWrapper data={data} colorTheme="categorical">
  <ChartXAxis dataKey="name" />
  <ChartYAxis />
  <ChartBar dataKey="sales" name="Sales" />
  <ChartBar dataKey="profit" name="Profit" />
</ChartBarWrapper>
```

## Best Practices

1. **Let Blade Handle Color Assignment** - Don't manually assign colors unless you have specific branding requirements
2. **Use Appropriate Chart Types** - Different chart types are optimized for different data visualizations
3. **Consider Data Density** - For charts with many data series, the color system will cycle through the sequence

## Troubleshooting

- **Colors Not Appearing**: Ensure you're using the latest version of Blade and check that your chart data is properly formatted
- **Inconsistent Colors**: Blade automatically manages color consistency; avoid manually setting colors unless necessary
- **Single Data Point Issues**: Single data points automatically use gray color for visual clarity

## Future Enhancements

Future versions may include:
- Sequential color themes for data with inherent ordering
- Diverging color themes for data with meaningful center points
- Custom color palette support for brand-specific requirements
