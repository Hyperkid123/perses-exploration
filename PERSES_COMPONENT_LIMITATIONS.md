# Perses Component Limitations Analysis

## Overview

This document identifies limitations in PatternFly compatibility with Perses dashboard components. Current integration works for containers but not chart internals.

## Architectural Limitations

### 🚫 **ECharts Dependency**
- **Root Cause**: Perses uses ECharts internally, which has zero PatternFly awareness
- **Problem**: ECharts expects hex colors, not CSS variables
- **Result**: Charts will always look "foreign" in PatternFly applications
- **Fix Required**: Replace ECharts with PatternFly Charts or build CSS variable injection layer

### 🚫 **Rigid Plugin Architecture**
- **Root Cause**: Perses plugin system locks configuration options
- **Problem**: Cannot extend styling beyond what Perses explicitly allows
- **Result**: No access to chart internals for PatternFly styling
- **Fix Required**: Modify Perses plugin interfaces to expose styling hooks

### 🚫 **MUI Theme Conflicts**
- **Root Cause**: Some components require MUI DataGrid with full MUI theme
- **Problem**: MUI theme overrides PatternFly styles globally
- **Result**: Inconsistent design language across application
- **Fix Required**: Completely replace MUI dependencies or implement strict CSS isolation

### 🚫 **Data-Visualization Coupling**
- **Root Cause**: Data fetching and visualization are tightly coupled in Perses components
- **Problem**: Cannot swap visualization layer while keeping data layer
- **Result**: All-or-nothing component replacement required
- **Fix Required**: Separate data providers from visualization components

## Component-Specific Limitations

### 📊 **TimeSeriesChart**
- ❌ **CSS Variables**: Cannot use PatternFly CSS variables directly in visual config
- ❌ **Advanced Theming**: Limited to predefined visual options
- ❌ **Custom Animations**: No animation configuration options
- ✅ **Strong Points**: Comprehensive visual options, good PatternFly color integration

### 📈 **BarChart**
- ❌ **Individual Bar Styling**: No per-bar customization options
- ❌ **Advanced Layout**: No horizontal bar chart option
- ❌ **Animation Control**: Limited animation configuration
- ❌ **Interactive Features**: No built-in click/hover handlers
- ❌ **Legend Customization**: No legend display options

### 🔥 **FlameChart**
- ❌ **Composite Components**: Limited customization of internal table/graph pieces
- ❌ **PatternFly Table**: Cannot directly style internal table with PF components
- ❌ **CSS Override Requirement**: Would need brittle CSS rules for PF styling
- ⚠️ **Theme Integration**: Limited to overall container theming

### ⚡ **GaugeChart**
- ❌ **Arc Styling**: No rounded corners option (fixed rectangular cells)
- ❌ **Color Schemes**: Hard-coded blue→yellow→red gradient (not PF colors)
- ❌ **Legend Customization**: No legend display options
- ❌ **Value Formatting**: Limited formatting controls
- ❌ **CSS Variables**: Cannot use PatternFly CSS variables directly

### 🗺️ **HeatMapChart**
- ❌ **Color Scheme**: Hard-coded blue→yellow→red gradient (not PF styling)
- ❌ **Cell Styling**: No rounded corners option (fixed rectangular cells)
- ❌ **Hover Effects**: Fixed #333 border (no PF interaction styles)
- ❌ **Grid Spacing**: Standard ECharts spacing (cannot adjust with PF tokens)
- ❌ **Legend Styling**: Fixed chart legend (no PF typography options)

### 📊 **HistogramChart**
- ❌ **Color Scheme**: Hard-coded blue→yellow→red gradient (not PF colors)
- ❌ **Legend Customization**: No legend display options
- ❌ **Bar Styling**: Fixed ECharts appearance (no PF design integration)
- ❌ **Interaction States**: No hover/focus states (no PF interaction patterns)

### 🥧 **PieChart**
- ❌ **Legend Customization**: No legend display options
- ❌ **Slice Styling**: Fixed slice appearance (no PF styling)
- ❌ **Hover Effects**: Standard ECharts hover (no PF interaction styles)
- ❌ **Color Palette**: Limited to ECharts color schemes

### 🎯 **ScatterChart**
- ❌ **Point Styling**: Limited point customization options
- ❌ **Axis Customization**: Basic axis configuration only
- ❌ **Grid Styling**: Standard ECharts grid (no PF styling)
- ❌ **Tooltip Customization**: Basic tooltip options only

### 📊 **StatChart**
- ❌ **Layout Options**: Single stat display only (no multi-stat layouts)
- ❌ **Typography Control**: Limited font styling options
- ❌ **Background Styling**: Basic background options
- ❌ **Icon Integration**: No icon support

### 📈 **StatusHistoryChart**
- ❌ **Minimal Configuration**: Very limited customization options (only 2 properties)
- ❌ **Chart Type**: Fixed grid-based heatmap, no alternative layouts
- ❌ **Time Granularity**: Limited control over time bucket sizing
- ❌ **Cell Styling**: Fixed cell shapes and borders
- ❌ **CSS Variables**: Cannot use PatternFly CSS variables directly

### 📋 **TimeSeriesTable**
- ❌ **Zero Configuration**: Empty interface - no customization options available
- ❌ **Column Control**: No custom column configuration
- ❌ **Styling Options**: No appearance customization
- ❌ **Data Formatting**: No custom formatters

### 🗂️ **TraceTable**
- ❌ **MUI DataGrid Dependency**: Uses MUI DataGrid exclusively, cannot use PatternFly tables
- ❌ **Theme Conflicts**: Requires isolated ThemeProvider to avoid PatternFly CSS conflicts
- ❌ **Fixed Table Structure**: Cannot replace with PatternFly Table components
- ❌ **Column Configuration**: No custom column controls or visibility options
- ❌ **Advanced Filtering**: No built-in filtering or search options
- ❌ **CSS Variables**: Cannot use PatternFly CSS variables due to theme isolation

### 📊 **TracingGanttChart**
- ❌ **Complex Component Structure**: Uses specialized Gantt chart components, not PatternFly
- ❌ **Theme Conflicts**: Requires isolated ThemeProvider to avoid PatternFly CSS conflicts
- ❌ **Fixed Gantt Layout**: Cannot replace with PatternFly timeline components
- ❌ **Timeline Orientation**: No horizontal/vertical toggle options
- ❌ **Color Schemes**: Limited to palette mode options ('auto' or 'categorical')
- ❌ **CSS Variables**: Cannot use PatternFly CSS variables due to theme isolation

## Required Changes for 100% PatternFly Compatibility

### Option 1: **Contribute CSS Variable Support to Perses**
```typescript
// Modify @perses-dev/components/src/ChartsProvider
// Add CSS variable resolution layer
const resolvePatternFlyVariables = (theme: ChartsTheme) => {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    ...theme,
    echartsTheme: {
      ...theme.echartsTheme,
      color: theme.echartsTheme.color.map(color =>
        color.startsWith('var(')
          ? computedStyle.getPropertyValue(color.slice(4, -1))
          : color
      )
    }
  };
};
```

### Option 2: **Replace Chart Engine**
```typescript
// Replace ECharts with PatternFly Charts in Perses plugins
// Modify @perses-dev/prometheus-plugin/src/TimeSeriesChart
import { Chart, ChartLine, ChartAxis } from '@patternfly/react-charts';

// This requires rewriting entire chart rendering logic
```

### Option 3: **Data-Visualization Separation**
```typescript
// Create new architecture:
// 1. Perses Data Layer (keep)
// 2. PatternFly Visualization Layer (new)

interface DataProvider {
  useTimeSeriesData(query: string): TimeSeriesData[];
  useBarChartData(query: string): BarChartData[];
}

interface VisualizationComponent {
  data: ChartData;
  theme: PatternFlyChartTheme;
}
```

### Option 4: **CSS Variable Bridge**
```typescript
// Runtime CSS variable injection
class PatternFlyChartTheme {
  private getVariableValue(variable: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable);
  }

  public generateEChartsTheme(): EChartsTheme {
    return {
      color: [
        this.getVariableValue('--pf-t--global--color--brand--default'),
        this.getVariableValue('--pf-t--global--color--success--default'),
        // ... etc
      ]
    };
  }
}
```

## Code Changes Required in Perses Libraries

### **@perses-dev/components**
1. **ChartsProvider.tsx**: Add CSS variable resolution
2. **generateChartsTheme.ts**: Support dynamic theme generation
3. **Panel.tsx**: Expose styling hooks

### **@perses-dev/plugin-system**
1. **PluginDefinition.ts**: Add styling extension points
2. **ChartDefinition.ts**: Support custom renderers

### **Individual Chart Plugins**
1. Replace ECharts with PatternFly Charts
2. Rewrite rendering logic
3. Update TypeScript interfaces

## Realistic Assessment

### **Current State**: Limited PatternFly Integration
- Container styling works
- Typography works
- Layout works
- Charts use ECharts styling

### **With Workarounds**: Partial PatternFly Integration
- Colors manually aligned
- Some visual consistency
- Still uses ECharts internals

### **For Full Compatibility**: Major Engineering Required
- Contribute to Perses core libraries
- Replace chart engine
- Rewrite visualization components

## Bottom Line

**Current integration is cosmetic**. Real PatternFly compatibility requires fundamental changes to Perses architecture. The question is whether the effort justifies the result, or if building custom PatternFly dashboard components from scratch would be more practical.