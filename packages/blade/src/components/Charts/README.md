# Charts Components

This directory contains Blade's chart components built on top of Recharts with design system styling.

## Components

### LineChart Components

- **LineChart**: Main container component with predefined margins
- **Line**: Chart line with custom styling options (solid, dashed, dotted)
- **ReferenceLine**: Reference lines for markers
- **XAxis/YAxis**: Styled axis components 
- **CartesianGrid**: Styled grid component
- **Tooltip**: Themed tooltip
- **Legend**: Themed legend
- **ResponsiveContainer**: Responsive wrapper
- **ChartTooltip**: Custom tooltip for forecast charts

## Usage Examples

### Simple Line Chart
```tsx
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={chartData}>
    <CartesianGrid />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line dataKey="teamA" name="Team A" strokeStyle="solid" />
    <Line dataKey="teamB" name="Team B" strokeStyle="solid" />
    <ReferenceLine y={2200} label="Minimum" />
  </LineChart>
</ResponsiveContainer>
```

### Tiny Line Chart
```tsx
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={chartData}>
    <Line dataKey="teamA" strokeStyle="solid" />
  </LineChart>
</ResponsiveContainer>
```

### Forecast Line Chart
```tsx
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={forecastData}>
    <CartesianGrid />
    <XAxis dataKey="date" />
    <YAxis />
    <ChartTooltip />
    <Legend />
    <Line dataKey="historical" name="Historical Data" connectNulls={true} />
    <Line dataKey="forecast" name="Forecast" strokeStyle="dashed" connectNulls={true} legendType="none" />
  </LineChart>
</ResponsiveContainer>
```

## Color Tokens

The components use Blade color tokens:
- `surface.text.gray.normal`
- `surface.text.gray.muted`
- `interactive.background.primary.default`
- `feedback.text.positive.subtle`
- `feedback.text.negative.subtle`
- `feedback.text.notice.subtle`
- `feedback.text.information.subtle`

## Implementation Status

✅ **Completed:**
- LineChart component with predefined margins
- Line component with custom color and stroke style support
- ReferenceLine component
- Styled XAxis, YAxis, CartesianGrid, Tooltip, Legend
- ResponsiveContainer re-export
- ChartTooltip component
- TypeScript interfaces
- Storybook examples

⚠️ **Known Issues:**
- Some TypeScript type conflicts between React and Recharts types
- Need to refine color token resolution for all theme modes

## Next Steps

1. Fix TypeScript type issues with dot and margin props
2. Add more chart types (Bar, Area, Pie, etc.)
3. Add more comprehensive color token support
4. Add accessibility features
5. Add animation presets 