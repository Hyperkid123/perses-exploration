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
const query = 'avg(cpu_usage_percent) by (service)';

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
                kind: 'StatChart',
                spec: {
                  calculation: 'last', // 'last', 'mean', 'max', 'min', 'sum'
                  format: { unit: 'percent' }, // Unit formatting
                  sparkline: {
                    color: '#06c', // PatternFly primary blue
                    width: 2, // Sparkline thickness
                  },
                  valueFontSize: 'lg', // 'xs', 'sm', 'md', 'lg', 'xl'
                  thresholds: {
                    defaultColor: '#3e8635', // PatternFly success green
                    steps: [
                      { value: 30, color: '#3e8635' }, // Success
                      { value: 70, color: '#f0ab00' }, // Warning
                      { value: 85, color: '#c9190b' }, // Danger
                    ],
                  },
                  // metricLabel: 'CPU Usage', // Optional custom label
                  // mappings: [], // Optional value mappings
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesStatChart = () => {
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
            ✅ <strong>format:</strong> FormatOptions - Value formatting (unit, decimal places, short values)
          </ListItem>
          <ListItem>
            ✅ <strong>sparkline:</strong> StatChartSparklineOptions - Mini trend line configuration (color, width)
          </ListItem>
          <ListItem>
            ✅ <strong>valueFontSize:</strong> FontSizeOption - Value text size (&lsquo;xs&rsquo;, &lsquo;sm&rsquo;, &lsquo;md&rsquo;, &lsquo;lg&rsquo;,
            &lsquo;xl&rsquo;)
          </ListItem>
          <ListItem>
            ✅ <strong>thresholds:</strong> ThresholdOptions - Color-coded value ranges with custom colors
          </ListItem>
          <ListItem>
            ✅ <strong>metricLabel:</strong> string (optional) - Custom label for the metric
          </ListItem>
          <ListItem>
            ✅ <strong>mappings:</strong> ValueMapping[] (optional) - Value transformation mappings
          </ListItem>
          <ListItem>
            ✅ <strong>Current Configuration:</strong> calculation: &lsquo;last&rsquo;, format: {`{ unit: 'percent' }`}, sparkline:{' '}
            {`{ color: '#06c', width: 2 }`} (PatternFly blue), valueFontSize: &lsquo;lg&rsquo;, thresholds: PatternFly color scheme (green → yellow → red)
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
            ✅ <strong>Color Palette:</strong> Full threshold color control using PatternFly hex codes
          </ListItem>
          <ListItem>
            ✅ <strong>Typography:</strong> Inherits PatternFly fonts via CSS variables
          </ListItem>
          <ListItem>
            ⚠️ <strong>Height Issue Fixed:</strong> Changed from fixed height to minHeight to prevent NaN errors
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
            ❌ <strong>Layout Control:</strong> Fixed stat card layout and spacing
          </ListItem>
        </List>
      ),
    },
  ];

  return (
    <WidgetCard title='StatChart Widget' sections={sections}>
      <PersesWidgetWrapper>
        <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
          <TimeSeries />
        </TimeRangeProvider>
      </PersesWidgetWrapper>
    </WidgetCard>
  );
};

export default PersesStatChart;
