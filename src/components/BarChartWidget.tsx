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
                kind: 'BarChart',
                spec: {
                  calculation: 'last',
                  format: { unit: 'percent' },
                  sort: 'desc', // 'asc' or 'desc'
                  mode: 'value', // 'value' or 'percentage'
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesBarChart = () => {
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
        <Content>BarChart Customization Options:</Content>
        <List>
          <ListItem>
            ✅ <strong>Calculation:</strong> &lsquo;last&rsquo;, &lsquo;mean&rsquo;, &lsquo;max&rsquo;, &lsquo;min&rsquo;, &lsquo;sum&rsquo;
          </ListItem>
          <ListItem>
            ✅ <strong>Format:</strong> unit formatting (percent, bytes, seconds, etc.)
          </ListItem>
          <ListItem>
            ✅ <strong>Sort:</strong> &lsquo;asc&rsquo; or &lsquo;desc&rsquo; for bar ordering
          </ListItem>
          <ListItem>
            ✅ <strong>Mode:</strong> &lsquo;value&rsquo; (actual values) or &lsquo;percentage&rsquo; (relative percentages)
          </ListItem>
          <ListItem>
            ✅ <strong>Theme Integration:</strong> Uses chartsTheme.echartsTheme.bar for styling
          </ListItem>
        </List>
        <Content>PatternFly Styling via ChartsTheme:</Content>
        <List>
          <ListItem>
            ✅ <strong>Bar Colors:</strong> PatternFly color palette via chartsTheme.echartsTheme.color[]
          </ListItem>
          <ListItem>
            ✅ <strong>Bar Styling:</strong> Configure via chartsTheme.echartsTheme.bar options
          </ListItem>
          <ListItem>
            ✅ <strong>Typography:</strong> PatternFly fonts via CSS variables
          </ListItem>
          <ListItem>
            ✅ <strong>Grid & Axes:</strong> PatternFly colors via chartsTheme.echartsTheme.grid
          </ListItem>
          <ListItem>
            ✅ <strong>Tooltips:</strong> PatternFly styling via chartsTheme.echartsTheme.tooltip
          </ListItem>
        </List>
        <Content>Customization Limitations:</Content>
        <List>
          <ListItem>
            ❌ <strong>Individual Bar Styling:</strong> No per-bar customization
          </ListItem>
          <ListItem>
            ❌ <strong>Advanced Layout:</strong> No horizontal bar chart option
          </ListItem>
          <ListItem>
            ❌ <strong>Animation Control:</strong> Limited animation configuration
          </ListItem>
          <ListItem>
            ❌ <strong>Interactive Features:</strong> No built-in click/hover handlers
          </ListItem>
          <ListItem>
            ❌ <strong>Legend Customization:</strong> No legend display options
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

export default PersesBarChart;
