import { useMemo, useRef, useState } from 'react';
import { AbsoluteTimeRange, RelativeTimeRange, TimeRangeValue } from '@perses-dev/core';
import { Panel } from '@perses-dev/dashboards';
import { DataQueriesProvider, TimeRangeProvider, useSuggestedStepMs } from '@perses-dev/plugin-system';
import { DEFAULT_TEMPO } from '@perses-dev/tempo-plugin';
import useResizeObserver from 'use-resize-observer';
import PersesWidgetWrapper from './PersesWrapper';
import { Box, ListItem } from '@mui/material';
import { Content, List, Switch } from '@patternfly/react-core';

const start = '2023-10-01T00:00:00Z';
const end = '2023-10-01T01:00:00Z';
const query = '{service.name=~".*service"} | avg(duration) > 100ms';

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
  const datasource = DEFAULT_TEMPO;
  const panelRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver({ ref: panelRef });
  const suggestedStepMs = useSuggestedStepMs(width);

  const definitions = [
    {
      kind: 'TempoTraceQuery',
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
                kind: 'ScatterChart',
                spec: {
                  sizeRange: [8, 30],
                  link: '/traces/{traceId}?datasource={datasourceName}',
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesScatterChart = () => {
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
        <Content>Scatter Chart Customization Options:</Content>
        <List>
          <ListItem>
            <strong>✅ Point Size Range:</strong> `sizeRange: [min, max]` - Controls circle diameter (default: [6,20])
          </ListItem>
          <ListItem>
            <strong>✅ Click Navigation:</strong> `link` property supports trace navigation with variables
          </ListItem>
          <ListItem>
            <strong>✅ Theme Integration:</strong> Uses chartsTheme for default colors and ECharts theme
          </ListItem>
          <ListItem>
            <strong>✅ Error Highlighting:</strong> Automatic red coloring for traces with errors
          </ListItem>
          <ListItem>
            <strong>✅ Responsive Tooltips:</strong> Shows service, span, time, duration, and error info
          </ListItem>
          <ListItem>
            <strong>✅ chartsTheme Customization:</strong> Color palette, tooltips, grid, thresholds via `generateChartsTheme()`
          </ListItem>
        </List>
        <Content>Customization Limitations:</Content>
        <List>
          <ListItem>
            <strong>🔴 Point Colors:</strong> Hard-coded red for errors, theme default for normal traces
          </ListItem>
          <ListItem>
            <strong>🔴 Point Shapes:</strong> Only circles supported, no custom symbols
          </ListItem>
          <ListItem>
            <strong>🔴 Axis Styling:</strong> Fixed axis labels and formatting
          </ListItem>
          <ListItem>
            <strong>🔴 Grid Customization:</strong> Fixed grid spacing and positioning
          </ListItem>
          <ListItem>
            <strong>🔴 Legend Control:</strong> No legend configuration options
          </ListItem>
          <ListItem>
            <strong>🔴 Tooltip Styling:</strong> Hard-coded tooltip content and formatting
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

export default PersesScatterChart;
