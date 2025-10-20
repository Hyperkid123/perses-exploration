import { useMemo, useRef } from 'react';
import { AbsoluteTimeRange, RelativeTimeRange, TimeRangeValue } from '@perses-dev/core';
import { Panel } from '@perses-dev/dashboards';
import { DataQueriesProvider, TimeRangeProvider, useSuggestedStepMs } from '@perses-dev/plugin-system';
import { DEFAULT_PROM } from '@perses-dev/prometheus-plugin';
import useResizeObserver from 'use-resize-observer';
import PersesWidgetWrapper from './PersesWrapper';
import WidgetCard from './WidgetCard';
import { List, ListItem } from '@patternfly/react-core';

const start = '2023-10-01T00:00:00Z';
const end = '2023-10-01T01:00:00Z';
const query = 'cpu_usage{namespace=~".*"}';

const useTimeRange = () => {
  const result = useMemo(() => {
    let timeRange: TimeRangeValue;
    if (start && end) {
      timeRange = {
        start: new Date(start),
        end: new Date(end),
      } as AbsoluteTimeRange;
    } else {
      timeRange = { pastDuration: '1h' } as RelativeTimeRange;
    }
    return timeRange;
  }, []);
  return result;
};

const TimeSeries = () => {
  const datasource = DEFAULT_PROM;
  const panelRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver({ ref: panelRef });
  const suggestedStepMs = useSuggestedStepMs(width);

  const definitions = [
    {
      kind: 'PrometheusTimeSeriesQuery',
      spec: {
        datasource: {
          kind: datasource.kind,
          name: datasource.name,
        },
        query: query,
      },
    },
  ];

  return (
    <div ref={panelRef} style={{ width: '100%', height: '100%' }}>
      <DataQueriesProvider definitions={definitions} options={{ suggestedStepMs, mode: 'range' }}>
        <Panel
          panelOptions={{
            hideHeader: true,
          }}
          definition={{
            kind: 'Panel',
            spec: {
              queries: [],
              display: { name: '' },
              plugin: {
                kind: 'TimeSeriesChart',
                spec: {
                  legend: { placement: 'right' }, // Legend configuration and placement
                  yAxis: {
                    show: true, // Show Y-axis
                    label: 'CPU Usage (%)', // Y-axis label
                    // min: 0, // Y-axis minimum value
                    // max: 50, // Y-axis maximum value
                  },
                  visual: {
                    display: 'line', // 'line' or 'bar'
                    lineWidth: 2, // 0.25 to 3 (default 1.25)
                    lineStyle: 'solid', // 'solid', 'dashed', 'dotted'
                    areaOpacity: 0.1, // 0 to 1 (default 0) - fill under lines
                    pointRadius: 3, // 0 to 6 (default auto)
                    showPoints: 'auto', // 'auto' or 'always'
                    connectNulls: false, // connect or break lines at null data
                    stack: 'none', // 'none' or 'all'
                    palette: { mode: 'categorical' }, // 'auto' or 'categorical'
                  },
                  tooltip: {
                    enablePinning: true, // Enable tooltip pinning
                  },
                  // thresholds: { }, // Optional threshold configuration
                  // querySettings: [], // Optional per-query settings
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesTimeSeriesChart = () => {
  const timeRange = useTimeRange();

  const sections = [
    {
      id: 'customization',
      title: 'Customization Options',
      content: (
        <List>
          <ListItem>
            ✅ <strong>legend:</strong> LegendSpecOptions (optional) - Legend configuration and placement
          </ListItem>
          <ListItem>
            ✅ <strong>yAxis:</strong> TimeSeriesChartYAxisOptions (optional) - Y-axis configuration
          </ListItem>
          <ListItem>
            ✅ <strong>visual:</strong> TimeSeriesChartVisualOptions (optional) - Visual styling options
          </ListItem>
          <ListItem>
            ✅ <strong>tooltip:</strong> TooltipSpecOptions (optional) - Tooltip configuration
          </ListItem>
          <ListItem>
            ✅ <strong>thresholds:</strong> ThresholdOptions (optional) - Threshold lines and colors
          </ListItem>
          <ListItem>
            ✅ <strong>querySettings:</strong> QuerySettingsOptions[] (optional) - Per-query styling
          </ListItem>
        </List>
      ),
    },
    {
      id: 'visual',
      title: 'Visual Options',
      content: (
        <List>
          <ListItem>
            ✅ <strong>display:</strong> &lsquo;line&rsquo; or &lsquo;bar&rsquo; - Chart display type
          </ListItem>
          <ListItem>
            ✅ <strong>lineWidth:</strong> 0.25 to 3 - Line thickness (default: 1.25)
          </ListItem>
          <ListItem>
            ✅ <strong>lineStyle:</strong> &lsquo;solid&rsquo;, &lsquo;dashed&rsquo;, &lsquo;dotted&rsquo; - Line appearance
          </ListItem>
          <ListItem>
            ✅ <strong>areaOpacity:</strong> 0 to 1 - Fill opacity under lines (default: 0)
          </ListItem>
          <ListItem>
            ✅ <strong>pointRadius:</strong> 0 to 6 - Point size (default: auto)
          </ListItem>
          <ListItem>
            ✅ <strong>showPoints:</strong> &lsquo;auto&rsquo; or &lsquo;always&rsquo; - Point visibility
          </ListItem>
          <ListItem>
            ✅ <strong>connectNulls:</strong> boolean - Connect lines across null data
          </ListItem>
          <ListItem>
            ✅ <strong>stack:</strong> &lsquo;none&rsquo; or &lsquo;all&rsquo; - Stacking mode
          </ListItem>
          <ListItem>
            ✅ <strong>palette:</strong> Color palette configuration (auto/categorical)
          </ListItem>
          <ListItem>
            ✅ <strong>Current Configuration:</strong> line chart with 2px solid lines, 0.1 area opacity, 3px points, yAxis: visible with &lsquo;CPU Usage
            (%)&rsquo; label, tooltip: pinning enabled, legend: placed on the right
          </ListItem>
        </List>
      ),
    },
    {
      id: 'patternfly',
      title: 'PatternFly Integration',
      content: (
        <List>
          <ListItem>
            ✅ <strong>Color Palette:</strong> Uses chartsTheme.echartsTheme.color[] for line colors
          </ListItem>
          <ListItem>
            ✅ <strong>Typography:</strong> Inherits PatternFly fonts via CSS variables
          </ListItem>
          <ListItem>
            ✅ <strong>Theme Integration:</strong> Full chartsTheme.echartsTheme.line configuration support
          </ListItem>
          <ListItem>
            ✅ <strong>Per-Query Styling:</strong> Individual color and style settings per series
          </ListItem>
        </List>
      ),
    },
    {
      id: 'limitations',
      title: 'Limitations',
      content: (
        <List>
          <ListItem>
            ❌ <strong>CSS Variables:</strong> Cannot use PatternFly CSS variables directly - requires hex codes
          </ListItem>
          <ListItem>
            ❌ <strong>Advanced Theming:</strong> Limited to predefined visual options
          </ListItem>
          <ListItem>
            ❌ <strong>Custom Animations:</strong> No animation configuration options
          </ListItem>
        </List>
      ),
    },
  ];

  return (
    <WidgetCard title='TimeSeriesChart Widget' sections={sections}>
      <PersesWidgetWrapper>
        <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
          <TimeSeries />
        </TimeRangeProvider>
      </PersesWidgetWrapper>
    </WidgetCard>
  );
};

export default PersesTimeSeriesChart;
