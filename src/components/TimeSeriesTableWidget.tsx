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
const query = 'cpu_usage_table{namespace=~".*"}';

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
                kind: 'TimeSeriesTable',
                spec: {
                  // TimeSeriesTable has very limited customization options
                  // Most configuration is handled automatically by the plugin
                  calculation: 'last', // Only calculation method can be configured
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesTimeSeriesTable = () => {
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
        <Content>TimeSeriesTable Customization Options:</Content>
        <List>
          <ListItem>✅ Calculation Method: 'last', 'mean', 'max', 'min', etc.</ListItem>
          <ListItem>✅ Automatic Data Formatting: timestamps and values</ListItem>
          <ListItem>✅ Series Display Limit: max 1000 series for performance</ListItem>
          <ListItem>✅ Two-Column Layout: metric names + values</ListItem>
          <ListItem>✅ Scrollable Container: with MUI table styling</ListItem>
          <ListItem>✅ Histogram Support: embedded charts and bucket tables</ListItem>
          <ListItem>❌ Column Configuration: no custom columns</ListItem>
          <ListItem>❌ Sorting/Filtering: no built-in options</ListItem>
          <ListItem>❌ Pagination: no pagination controls</ListItem>
          <ListItem>❌ Column Visibility: no hide/show columns</ListItem>
          <ListItem>❌ Custom Styling: limited to theme colors</ListItem>
          <ListItem>❌ Header Customization: uses default MUI headers</ListItem>
          <ListItem>❌ Row Limits: no configurable row limits</ListItem>
          <ListItem>⚠️ Very Limited: TimeSeriesTableOptions interface is empty</ListItem>
        </List>
      </Box>
      <Box sx={{ height: '400px', width: width === 200 ? '200px' : '100%' }}>
        <PersesWidgetWrapper>
          <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
            <TimeSeries />
          </TimeRangeProvider>
        </PersesWidgetWrapper>
      </Box>
    </Box>
  );
};

export default PersesTimeSeriesTable;
