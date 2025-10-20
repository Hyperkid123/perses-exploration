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
const query = 'sum(rate(container_cpu_usage_seconds_total{container!="", image!=""}[5m])) by (namespace)';

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
                kind: 'PieChart',
                spec: {
                  calculation: 'last', // 'last', 'mean', 'max', 'min', 'sum'
                  radius: 80, // Pie chart radius percentage (0-100)
                  format: {
                    unit: 'decimal', // Unit formatting
                    decimalPlaces: 1, // Number precision
                    shortValues: true, // Use short notation (1k vs 1000)
                  },
                  sort: 'desc', // 'asc' or 'desc' for slice ordering
                  mode: 'value', // 'value' or 'percentage'
                  legend: {
                    placement: 'right', // Legend position
                  },
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesPieChart = () => {
  const timeRange = useTimeRange();

  const sections = [
    {
      id: 'customization',
      title: 'Customization Options',
      content: (
        <List>
          <ListItem>
            ✅ <strong>calculation:</strong> CalculationType - Data aggregation method (&lsquo;last&rsquo;, &lsquo;mean&rsquo;, &lsquo;max&rsquo;,
            &lsquo;min&rsquo;, &lsquo;sum&rsquo;)
          </ListItem>
          <ListItem>
            ✅ <strong>radius:</strong> number - Pie chart radius percentage (0-100)
          </ListItem>
          <ListItem>
            ✅ <strong>format:</strong> FormatOptions - Value formatting (unit, decimal places, short values)
          </ListItem>
          <ListItem>
            ✅ <strong>sort:</strong> SortOption - Slice ordering (&lsquo;asc&rsquo; or &lsquo;desc&rsquo;)
          </ListItem>
          <ListItem>
            ✅ <strong>mode:</strong> ModeOption - Display mode (&lsquo;value&rsquo; or &lsquo;percentage&rsquo;)
          </ListItem>
          <ListItem>
            ✅ <strong>legend:</strong> LegendSpecOptions - Legend configuration and placement
          </ListItem>
          <ListItem>
            ✅ <strong>Current Configuration:</strong> calculation: &lsquo;last&rsquo;, radius: 80, format:{' '}
            {`{ unit: 'decimal', decimalPlaces: 1, shortValues: true }`}, sort: &lsquo;desc&rsquo;, mode: &lsquo;value&rsquo;, legend:{' '}
            {`{ placement: 'right' }`}
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
            ✅ <strong>Color Palette:</strong> Uses chartsTheme.echartsTheme.color[] for slice colors
          </ListItem>
          <ListItem>
            ✅ <strong>Typography:</strong> Inherits PatternFly fonts via CSS variables
          </ListItem>
          <ListItem>
            ✅ <strong>Legend Styling:</strong> Configurable legend placement and styling
          </ListItem>
          <ListItem>
            ✅ <strong>Value Formatting:</strong> Comprehensive format options for data display
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
            ❌ <strong>Dynamic Height:</strong> Height tied to number of data segments - more slices = taller chart{' '}
            <a href='https://github.com/perses/plugins/blob/main/piechart/src/PieChartBase.tsx#L96' target='_blank' rel='noreferrer'>
              (see code)
            </a>
          </ListItem>
          <ListItem>
            ❌ <strong>Tooltip Overflow:</strong> Labels get cut off when hovering - missing tooltip configuration
          </ListItem>
          <ListItem>
            ❌ <strong>CSS Variables:</strong> Cannot use PatternFly CSS variables directly - requires hex codes
          </ListItem>
          <ListItem>
            ⚠️ <strong>Container Constraint:</strong> Tooltip confined to parent container bounds
          </ListItem>
        </List>
      ),
    },
  ];

  return (
    <WidgetCard title='PieChart Widget' sections={sections}>
      <PersesWidgetWrapper>
        <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
          <TimeSeries />
        </TimeRangeProvider>
      </PersesWidgetWrapper>
    </WidgetCard>
  );
};

export default PersesPieChart;
