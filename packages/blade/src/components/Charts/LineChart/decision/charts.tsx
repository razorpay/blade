

// -- Interface Examples --

interface Line {
  type: 'solid' | 'dashed' | 'dotted';
  stroke: string;
  strokeWidth: number;
  dot: boolean;
  activeDot: boolean;
  connectNulls: boolean;
  legendType: 'none' | 'line' | 'square' | 'diamond' | 'circle' | 'cross' | 'triangle' | 'triangleDown' | 'triangleUp' | 'star' | 'wye' | 'none';
  dataKey: string;
  name: string;
  strokeDasharray: string;
  color: BladeColorToken;
}

interface ReferenceLine {
    y: number;
    label: string;
    color: BladeColorToken;
}


// for components like ResponsiveContainer, Legend, CartesianGrid, XAxis, YAxis etc. we would be just styling them and re-exporting them . they don't need much changes.  
// since in case of  CartesianGrid, XAxis, YAxis ... you won't be able to change the color of the grid, x-axis, y-axis. 

const App = () => {
  // Data for Basic and Tiny charts
  const chartData = [
    { month: 'Jan', teamA: 2450, teamB: 2600 },
    { month: 'Feb', teamA: 2300, teamB: 2500 },
    { month: 'Mar', teamA: 2800, teamB: 2900 },
    { month: 'Apr', teamA: 2650, teamB: 2700 },
    { month: 'May', teamA: 3100, teamB: 3200 },
  ];

  // Data for Forecast chart
  const forecastData = [
    { date: 'Jan', historical: 2450, forecast: undefined },
    { date: 'Feb', historical: 2300, forecast: undefined },
    { date: 'Mar', historical: 2600, forecast: undefined },
    { date: 'Apr', historical: 2550, forecast: 2550 }, // Point where forecast starts
    { date: 'May', historical: undefined, forecast: 2800 },
    { date: 'Jun', historical: undefined, forecast: 2900 },
  ];

  // A custom tooltip example
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ backgroundColor: '#0D7AFF', color: 'white', padding: '1rem', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>{`Month: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '4px 0 0' }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', background: '#f9fafb' }}>
      <h1>LineChart Component Examples</h1>

      <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
        <h2>Example 1: Basic Chart</h2>
        <p>Demonstrates multiple lines, custom dot/stroke, a reference line, and a custom tooltip.</p>
        {/* In a real app, the outer div would be Blade's <ChartContainer> */}
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChat data={chartData}>
              <CartesianGrid />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                dataKey="teamA"
                name="Team A"
                type="solid"
               
              />
              <Line
                dataKey="teamB"
                name="Team B"
                type="solid"
              />
              <ReferenceLine y={2200} label="Minimum" color="" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginTop: '2rem', maxWidth: '400px' }}>
        <h2>Example 2: Tiny Chart (Sparkline)</h2>
        <p>A minimal "tiny" chart with no axes, grid, or dots.</p>
        {/* In a real app, the outer div would be Blade's <ChartContainer> */}
        <div style={{ width: '100%', height: '60px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                dataKey="teamA"
                type="solid"
                color="blue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginTop: '2rem' }}>
        <h2>Example 3: Forecast Chart</h2>
        <p>Shows a solid historical line seamlessly connecting to a dashed forecast line.</p>
        {/* In a real app, the outer div would be Blade's <ChartContainer> */}
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid/>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                dataKey="historical"
                name="Historical Data"
                connectNulls={true}
              />
              <Line
                dataKey="forecast"
                name="Forecast"
                type="solid"
                connectNulls={true}
                legendType="none"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default App;
