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
                  calculation: 'last',
                  legend: { placement: 'right' },
                  value: { placement: 'center' },
                  // Visual customization options
                  displayType: 'line', // 'line' or 'bar'
                  lineWidth: 2, // 0.25 to 3 (default 1.25)
                  lineStyle: 'solid', // 'solid', 'dashed', 'dotted'
                  areaOpacity: 0.1, // 0 to 1 (default 0) - slight fill under lines
                  pointRadius: 3, // 0 to 6 (default auto)
                  pointDisplay: 'auto', // 'auto' or 'always'
                  connectNulls: false, // connect or break lines at null data
                  stackingMode: 'none', // 'none', 'all'
                  paletteMode: 'categorical', // 'auto' or 'categorical'
                  // Y-axis customization
                  yAxis: {
                    show: true,
                    label: 'CPU Usage (%)',
                    // min: 0,
                    // max: 50
                  },
                  // Tooltip options
                  tooltip: {
                    pinning: true
                  }
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
        <Content>TimeSeriesChart Customization Options:</Content>
        <List>
          <ListItem>✅ Display Type: 'line' or 'bar'</ListItem>
          <ListItem>✅ Line Width: 0.25 to 3 (currently: 2)</ListItem>
          <ListItem>✅ Line Style: 'solid', 'dashed', 'dotted'</ListItem>
          <ListItem>✅ Area Opacity: 0 to 1 (currently: 0.1 for slight fill)</ListItem>
          <ListItem>✅ Point Radius: 0 to 6 (currently: 3)</ListItem>
          <ListItem>✅ Point Display: 'auto' or 'always'</ListItem>
          <ListItem>✅ Connect Nulls: true/false for line breaks at null data</ListItem>
          <ListItem>✅ Stacking Mode: 'none', 'all'</ListItem>
          <ListItem>✅ Palette Mode: 'auto' or 'categorical'</ListItem>
          <ListItem>✅ Y-Axis: show/hide, label, min/max values</ListItem>
          <ListItem>✅ Tooltip: pinning support</ListItem>
          <ListItem>✅ Per-Query: individual color/style per series</ListItem>
          <ListItem>❌ Full color palette control (limited to fixed modes)</ListItem>
          <ListItem>❌ Advanced theming beyond basic options</ListItem>
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

export default PersesTimeSeriesChart;
