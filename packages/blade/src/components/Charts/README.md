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

### PieChart Components

- **PieChart**: Main pie chart container component
- **Pie**: Pie/donut chart with configurable radius and angles
- **Cell**: Individual pie slice with color tokens
- **Label**: Styled labels for center text in donuts
- **Tooltip/Legend/ResponsiveContainer**: Shared styled components

### AreaChart Components

- **AreaChart**: Main area chart container component with predefined margins
- **Area**: Area component with auto-color assignment and stacking support
- **ReferenceLine**: Reference lines for area charts
- **XAxis/YAxis/CartesianGrid/Tooltip/Legend/ResponsiveContainer**: Shared styled components

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

### Simple Area Chart
```tsx
<ResponsiveContainer width="100%" height="100%">
  <AreaChart data={chartData}>
    <CartesianGrid />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Area dataKey="teamA" name="Team A" type="monotone" />
  </AreaChart>
</ResponsiveContainer>
```

### Stacked Area Chart
```tsx
<ResponsiveContainer width="100%" height="100%">
  <AreaChart data={chartData}>
    <CartesianGrid />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Area dataKey="teamA" name="Team A" type="monotone" stackId="1" />
    <Area dataKey="teamB" name="Team B" type="monotone" stackId="1" />
    <Area dataKey="teamC" name="Team C" type="monotone" stackId="1" />
  </AreaChart>
</ResponsiveContainer>
```

### Area Chart with Null Connections
```tsx
<ResponsiveContainer width="100%" height="100%">
  <AreaChart data={dataWithNulls}>
    <CartesianGrid />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Area 
      dataKey="sales" 
      name="Sales" 
      type="monotone" 
      connectNulls={true}
      color="feedback.text.positive.subtle" 
    />
  </AreaChart>
</ResponsiveContainer>
```

### Tiny Area Chart (Sparkline)
```tsx
<ResponsiveContainer width="100%" height="100%">
  <AreaChart data={chartData}>
    <Area dataKey="teamA" name="Team A" type="monotone" />
  </AreaChart>
</ResponsiveContainer>
```

### Simple Pie Chart
```tsx
const COLORS = ['interactive.background.primary.default', 'feedback.text.positive.subtle', 'feedback.text.notice.subtle', 'surface.text.gray.muted'];

<ResponsiveContainer width="100%" height="100%">
  <PieChart>
    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" label>
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

### Donut Chart
```tsx
<ResponsiveContainer width="100%" height="100%">
  <PieChart>
    <Pie 
      data={data} 
      dataKey="value" 
      donutRadius="medium" 
      paddingAngle="small"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

### Donut with Center Text
```tsx
<ResponsiveContainer width="100%" height="100%">
  <PieChart>
    <Pie data={data} dataKey="value" donutRadius="large" paddingAngle="small">
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
      <Label 
        content={({ viewBox }) => (
          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
            <tspan style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {totalValue}
            </tspan>
            <tspan x={viewBox.cx} y={viewBox.cy + 24} style={{ fontSize: '14px' }}>
              Total
            </tspan>
          </text>
        )}
      />
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

### Half Pie Chart
```tsx
<ResponsiveContainer width="100%" height="100%">
  <PieChart>
    <Pie 
      data={data} 
      dataKey="value" 
      circleType="half" 
      label
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

## Line Component Props

### Dot Configuration Options
The `Line` component supports flexible dot configuration:

```tsx
// No dots for clean minimal charts
<Line dataKey="sales" dot={false} activeDot={false} />

// Default themed dots
<Line dataKey="sales" dot={true} activeDot={true} />

// Custom dot styling with size and colors
<Line 
  dataKey="sales" 
  dot={{ r: 6, fill: '#22c55e', stroke: '#16a34a', strokeWidth: 2 }} 
  activeDot={{ r: 8, fill: '#22c55e', stroke: '#ffffff', strokeWidth: 3 }}
/>

// Only active dots on hover (cleaner look)
<Line dataKey="sales" dot={false} activeDot={true} />

// Large custom dots
<Line 
  dataKey="sales" 
  dot={{ r: 8, fill: 'red', strokeWidth: 0 }} 
  activeDot={{ r: 12, fill: 'darkred' }}
/>
```

### Dot Configuration Properties
When using custom dot objects, you can configure:
- `r`: Radius of the dot
- `fill`: Fill color of the dot  
- `stroke`: Stroke color of the dot
- `strokeWidth`: Width of the stroke
- Any other SVG circle properties

### Use Cases
- **Tiny Charts**: `dot={false}` for minimal clutter
- **Dense Data**: Remove dots to prevent overlap
- **Brand Colors**: Custom colors that match your design
- **Interactive Focus**: Show only `activeDot` for hover states
- **Data Emphasis**: Larger dots for important data points

## Area Component Props

### Required Props
- `dataKey`: string - Key to identify data value in dataset (required)
- `name`: string - Display name for legend and tooltips (required)
- `type`: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone' - Interpolation type (required)

### Optional Props
- `stackId`: string | number - Groups areas into stacks (required for multiple areas >2)
- `connectNulls`: boolean - Connect area over null data points (default: false)
- `color`: BladeColorToken - Color token for area fill (auto-assigned if not provided)
- `fillOpacity`: number - Opacity of area fill (default: 0.6)
- `strokeWidth`: number - Width of area border (default: 2)

### Stacking Behavior
- For **2 or fewer areas**: No stackId needed, areas will naturally overlay
- For **3+ areas**: Must provide `stackId` to each area for proper stacking
- Areas with the same `stackId` will be stacked together

### Auto-Color Assignment
- Colors are automatically assigned from a curated palette of Blade tokens
- **Curated Palette**: primary → success → warning → info → neutral
- Colors cycle through the palette for multiple areas
- Override with `color` prop for specific branding needs

## Pie Component Props

### Donut Radius Options
- `none`: Regular pie chart (innerRadius: 0)
- `small`: Small donut hole (innerRadius: 40, outerRadius: 80)
- `medium`: Medium donut hole (innerRadius: 50, outerRadius: 90)
- `large`: Large donut hole (innerRadius: 60, outerRadius: 100)
- `extraLarge`: Extra large donut hole (innerRadius: 70, outerRadius: 110)

### Circle Type Options
- `full`: Complete 360° circle (default)
- `half`: Semi-circle (180°)
- `quarter`: Quarter circle (90°)

### Padding Angle Options
- `none`: No spacing between slices (default)
- `small`: 1px spacing
- `medium`: 2px spacing
- `large`: 4px spacing
- `extraLarge`: 6px spacing

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
- **Optional dots and activeDots for Line component**
- ReferenceLine component
- **PieChart component with Blade styling**
- **Pie component with donutRadius, circleType, and paddingAngle**
- **Cell component with color token support**
- **Label component for center text in donuts**
- **AreaChart component with predefined margins**
- **Area component with auto-color assignment and stacking**
- **connectNulls support for handling null data points**
- **Curated color palette with automatic assignment**
- Styled XAxis, YAxis, CartesianGrid, Tooltip, Legend
- ResponsiveContainer re-export
- ChartTooltip component
- TypeScript interfaces
- Comprehensive Storybook examples for all chart types

⚠️ **Known Issues:**
- Some TypeScript type conflicts between React and Recharts types
- Need to refine color token resolution for all theme modes

## Next Steps

1. Fix TypeScript type issues with margin props across all chart types
2. Add more chart types (Bar, Scatter, etc.)
3. Add more comprehensive color token support
4. Add accessibility features
5. Add animation presets 