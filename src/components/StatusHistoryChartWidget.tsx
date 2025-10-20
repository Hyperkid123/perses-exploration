import { useMemo, useRef, useState } from 'react';
import { AbsoluteTimeRange, RelativeTimeRange, TimeRangeValue } from '@perses-dev/core';
import { Panel } from '@perses-dev/dashboards';
import { DataQueriesProvider, TimeRangeProvider, useSuggestedStepMs } from '@perses-dev/plugin-system';
import { DEFAULT_PROM } from '@perses-dev/prometheus-plugin';
import useResizeObserver from 'use-resize-observer';
import PersesWidgetWrapper from './PersesWrapper';
import { Box, ListItem } from '@mui/material';
import { Content, List, Switch } from '@patternfly/react-core';

const start = '2023-10-01T00:00:00Z';
const end = '2023-10-01T01:00:00Z';
const query = 'up{job=~".*"}';

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
                kind: 'StatusHistoryChart',
                spec: {
                  legend: { placement: 'bottom' }, // Legend position ('bottom', 'right', 'top')
                  mappings: [
                    {
                      type: 'value', // Value mapping type
                      options: {
                        '0': { text: 'Down', color: '#c9190b' }, // PatternFly danger red
                        '1': { text: 'Up', color: '#3e8635' }, // PatternFly success green
                      },
                    },
                  ],
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesStatusHistoryChart = () => {
  const [width, setWidth] = useState<number>(400);
  const timeRange = useTimeRange();
  function toggleWidth() {
    setWidth((prevWidth) => (prevWidth === 400 ? 200 : 400));
  }
  return (
    <Box>
      <Box>
        <Switch checked={width === 200} onChange={toggleWidth} label='Toggle Width' />
      </Box>
      <Box>
        <Content>StatusHistoryChart Available Configuration Options:</Content>
        <List>
          <ListItem>
            ✅ <strong>legend:</strong> LegendSpecOptions (optional) - Legend configuration and placement
          </ListItem>
          <ListItem>
            ✅ <strong>mappings:</strong> ValueMapping[] (optional) - Maps values to text labels and colors
          </ListItem>
        </List>
        <Content>Current Configuration:</Content>
        <List>
          <ListItem>legend: {`{ placement: 'bottom' }`}</ListItem>
          <ListItem>mappings: Value-based mapping (0 → Down/Red, 1 → Up/Green)</ListItem>
          <ListItem>query: &apos;up{`{job=~".*"}`}&apos; - Service availability metric</ListItem>
        </List>
        <Content>Built-in Capabilities:</Content>
        <List>
          <ListItem>
            ✅ <strong>Service Monitoring:</strong> Shows service availability over time as grid heatmap
          </ListItem>
          <ListItem>
            ✅ <strong>Time-based Visualization:</strong> Historical status tracking with time buckets
          </ListItem>
          <ListItem>
            ✅ <strong>Multi-service Support:</strong> Displays multiple services in stacked rows
          </ListItem>
          <ListItem>
            ✅ <strong>Interactive Tooltips:</strong> Shows timestamp and status details on hover
          </ListItem>
        </List>
        <Content>PatternFly Integration Capabilities:</Content>
        <List>
          <ListItem>
            ✅ <strong>Status Colors:</strong> Uses PatternFly semantic colors (success green, danger red)
          </ListItem>
          <ListItem>
            ✅ <strong>Typography:</strong> Inherits PatternFly fonts via CSS variables
          </ListItem>
          <ListItem>
            ✅ <strong>Legend Styling:</strong> Configurable legend placement and styling
          </ListItem>
          <ListItem>
            ✅ <strong>Theme Integration:</strong> Uses chartsTheme for overall styling
          </ListItem>
        </List>
        <Content>Limitations:</Content>
        <List>
          <ListItem>
            ❌ <strong>Minimal Configuration:</strong> Very limited customization options (only 2 properties)
          </ListItem>
          <ListItem>
            ❌ <strong>Chart Type:</strong> Fixed grid-based heatmap, no alternative layouts
          </ListItem>
          <ListItem>
            ❌ <strong>Time Granularity:</strong> Limited control over time bucket sizing
          </ListItem>
          <ListItem>
            ❌ <strong>Cell Styling:</strong> Fixed cell shapes and borders
          </ListItem>
          <ListItem>
            ❌ <strong>CSS Variables:</strong> Cannot use PatternFly CSS variables directly - requires hex codes
          </ListItem>
        </List>
      </Box>
      <Box sx={{ height: '400px', width: `${width}px` }}>
        <PersesWidgetWrapper>
          <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
            <TimeSeries />
          </TimeRangeProvider>
        </PersesWidgetWrapper>
      </Box>
    </Box>
  );
};

export default PersesStatusHistoryChart;
