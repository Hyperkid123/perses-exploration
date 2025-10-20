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
                kind: 'HeatMapChart',
                spec: {
                  yAxisFormat: {
                    unit: 'decimal', // Y-axis value formatting (decimal, bytes, seconds, etc.)
                  },
                  countFormat: {
                    unit: 'decimal', // Count/frequency formatting for color mapping
                  },
                  showVisualMap: true, // Show color scale legend/visual map
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesHeatMapChart = () => {
  const timeRange = useTimeRange();

  const sections = [
    {
      id: 'customization',
      title: 'Customization Options',
      content: (
        <List>
          <ListItem>
            ✅ <strong>yAxisFormat:</strong> FormatOptions - Y-axis value formatting (unit, decimal places)
          </ListItem>
          <ListItem>
            ✅ <strong>countFormat:</strong> FormatOptions - Count/frequency formatting for color mapping
          </ListItem>
          <ListItem>
            ✅ <strong>showVisualMap:</strong> boolean - Toggle color scale legend visibility
          </ListItem>
          <ListItem>
            ✅ <strong>Current Configuration:</strong> yAxisFormat: {`{ unit: 'decimal' }`}, countFormat: {`{ unit: 'decimal' }`}, showVisualMap: true
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
            ⚠️ <strong>Theme Integration:</strong> Limited to chartsTheme.echartsTheme configuration
          </ListItem>
          <ListItem>
            ⚠️ <strong>Container Styling:</strong> Apply PF styles to wrapper components
          </ListItem>
          <ListItem>
            ⚠️ <strong>Font Integration:</strong> Uses PatternFly fonts via CSS variables
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
            ❌ <strong>Color Scheme:</strong> Hard-coded blue→yellow→red gradient (not PF colors)
          </ListItem>
          <ListItem>
            ❌ <strong>Cell Styling:</strong> No rounded corners option (fixed rectangular cells)
          </ListItem>
          <ListItem>
            ❌ <strong>Legend Styling:</strong> Fixed ECharts visual map (no PF styling)
          </ListItem>
          <ListItem>
            ❌ <strong>Grid Spacing:</strong> Standard ECharts spacing (cannot adjust cell gaps)
          </ListItem>
          <ListItem>
            ❌ <strong>Typography:</strong> Limited to theme fonts (no PF typography control)
          </ListItem>
          <ListItem>
            ❌ <strong>Hover Effects:</strong> Fixed #333 border (no PF interaction styles)
          </ListItem>
          <ListItem>
            ❌ <strong>CSS Variables:</strong> Cannot use PatternFly CSS variables for colors
          </ListItem>
        </List>
      ),
    },
  ];

  return (
    <WidgetCard title='HeatMapChart Widget' sections={sections}>
      <PersesWidgetWrapper>
        <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
          <TimeSeries />
        </TimeRangeProvider>
      </PersesWidgetWrapper>
    </WidgetCard>
  );
};

export default PersesHeatMapChart;
