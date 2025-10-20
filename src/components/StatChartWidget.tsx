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
                  calculation: 'last',
                  format: { unit: 'percent' },
                  sparkline: {
                    color: '#06c',
                    width: 2
                  },
                  valueFontSize: 'lg',
                  thresholds: {
                    defaultColor: '#3e8635',
                    steps: [
                      { value: 30, color: '#3e8635' },
                      { value: 70, color: '#f0ab00' },
                      { value: 85, color: '#c9190b' }
                    ]
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

const PersesStatChart = () => {
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
        <Content>Stat Chart Customization Options:</Content>
        <List>
          <ListItem>
            <strong>✅ Calculation Method:</strong> `calculation` - 'last', 'mean', 'max', 'min', 'sum'
          </ListItem>
          <ListItem>
            <strong>✅ Sparkline Config:</strong> `sparkline.color`, `sparkline.width` - Mini trend line
          </ListItem>
          <ListItem>
            <strong>✅ Value Font Size:</strong> `valueFontSize` - 'xs', 'sm', 'md', 'lg', 'xl'
          </ListItem>
          <ListItem>
            <strong>✅ Color Thresholds:</strong> `thresholds.steps` - Value-based color coding
          </ListItem>
          <ListItem>
            <strong>✅ Format Options:</strong> `format.unit` - 'percent', 'bytes', 'seconds', etc.
          </ListItem>
          <ListItem>
            <strong>✅ Theme Integration:</strong> Uses chartsTheme for colors and styling
          </ListItem>
          <ListItem>
            <strong>✅ Simplified Query:</strong> Using 'avg(cpu_usage_percent) by (service)' for better visibility
          </ListItem>
        </List>
        <Content>Customization Limitations:</Content>
        <List>
          <ListItem>
            <strong>🔴 Text Size:</strong> Fixed font sizes, not responsive to container size
          </ListItem>
          <ListItem>
            <strong>🔴 Color Thresholds:</strong> Limited threshold-based coloring options
          </ListItem>
          <ListItem>
            <strong>🔴 Layout Control:</strong> Fixed stat card layout and spacing
          </ListItem>
          <ListItem>
            <strong>🔴 Value Formatting:</strong> Basic number formatting, limited unit options
          </ListItem>
        </List>
      </Box>
      <Box sx={{ height: '200px', width: `${width}px` }}>
        <PersesWidgetWrapper>
          <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
            <TimeSeries />
          </TimeRangeProvider>
        </PersesWidgetWrapper>
      </Box>
    </Box>
  );
};

export default PersesStatChart;
