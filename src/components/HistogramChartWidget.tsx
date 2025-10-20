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
const query = 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))';

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
                kind: 'HistogramChart',
                spec: {
                  format: {
                    unit: 'decimal', // Unit formatting (decimal, bytes, seconds, etc.)
                    decimalPlaces: 0, // Number precision
                    shortValues: true, // Use short notation (1k vs 1000)
                  },
                  min: 0, // Minimum value for histogram range
                  max: 10, // Maximum value for histogram range
                  thresholds: {
                    defaultColor: '#06c', // PatternFly primary blue
                    steps: [
                      { value: 2, color: '#3e8635' }, // PatternFly success green
                      { value: 5, color: '#f0ab00' }, // PatternFly warning yellow
                      { value: 8, color: '#c9190b' }, // PatternFly danger red
                    ],
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

const PersesHistogramChart = () => {
  const timeRange = useTimeRange();

  const sections = [
    {
      id: 'customization',
      title: 'Customization Options',
      content: (
        <List>
          <ListItem>
            ✅ <strong>format:</strong> FormatOptions - Value formatting (unit, decimal places, short values)
          </ListItem>
          <ListItem>
            ✅ <strong>min:</strong> number - Minimum value for histogram range
          </ListItem>
          <ListItem>
            ✅ <strong>max:</strong> number - Maximum value for histogram range
          </ListItem>
          <ListItem>
            ✅ <strong>thresholds:</strong> ThresholdOptions - Color-coded value ranges with custom colors
          </ListItem>
          <ListItem>
            ✅ <strong>Current Configuration:</strong> format: {`{ unit: 'decimal', decimalPlaces: 0, shortValues: true }`}, min: 0, max: 10, thresholds: PatternFly color scheme (blue, green, yellow, red)
          </ListItem>
        </List>
      )
    },
    {
      id: 'patternfly',
      title: 'PatternFly Integration',
      content: (
        <List>
          <ListItem>
            ✅ <strong>Color Palette:</strong> Full control over threshold colors using PatternFly hex codes
          </ListItem>
          <ListItem>
            ✅ <strong>Typography:</strong> Inherits PatternFly fonts via CSS variables
          </ListItem>
          <ListItem>
            ✅ <strong>Value Formatting:</strong> Comprehensive format options for data display
          </ListItem>
          <ListItem>
            ✅ <strong>Range Control:</strong> Configurable min/max values for histogram buckets
          </ListItem>
        </List>
      )
    },
    {
      id: 'limitations',
      title: 'Limitations',
      content: (
        <List>
          <ListItem>
            ❌ <strong>Tooltip Overflow:</strong> Labels get cut off when hovering on chart segments - missing tooltip configuration
          </ListItem>
          <ListItem>
            ❌ <strong>CSS Variables:</strong> Cannot use PatternFly CSS variables directly - requires hex codes
          </ListItem>
          <ListItem>
            ⚠️ <strong>Bar Styling:</strong> No built-in rounded corners for bars
          </ListItem>
          <ListItem>
            ⚠️ <strong>Typography:</strong> Standard ECharts typography (theme-dependent)
          </ListItem>
          <ListItem>
            ⚠️ <strong>Tooltip Styling:</strong> Basic tooltip styling (not PatternFly-styled)
          </ListItem>
        </List>
      )
    }
  ];

  return (
    <WidgetCard title="HistogramChart Widget" sections={sections}>
      <PersesWidgetWrapper>
        <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
          <TimeSeries />
        </TimeRangeProvider>
      </PersesWidgetWrapper>
    </WidgetCard>
  );
};

export default PersesHistogramChart;
