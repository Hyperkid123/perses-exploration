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
                  legend: { placement: 'bottom' },
                  mappings: [
                    {
                      type: 'value',
                      options: {
                        '0': { text: 'Down', color: '#c9190b' },
                        '1': { text: 'Up', color: '#3e8635' },
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
        <Content>Status History Chart Customization Options:</Content>
        <List>
          <ListItem>
            <strong>✅ Value Mappings:</strong> `mappings` - Maps values (0/1) to text and colors
          </ListItem>
          <ListItem>
            <strong>✅ Legend Placement:</strong> `legend.placement` - 'bottom', 'right', 'top'
          </ListItem>
          <ListItem>
            <strong>✅ Status Colors:</strong> Custom colors for Up (green) and Down (red)
          </ListItem>
          <ListItem>
            <strong>✅ Service Monitoring:</strong> Shows service availability over time
          </ListItem>
          <ListItem>
            <strong>✅ Theme Integration:</strong> Uses chartsTheme for styling
          </ListItem>
        </List>
        <Content>Customization Limitations:</Content>
        <List>
          <ListItem>
            <strong>🔴 Chart Type:</strong> Fixed grid-based heatmap, no alternative layouts
          </ListItem>
          <ListItem>
            <strong>🔴 Time Granularity:</strong> Limited control over time bucket sizing
          </ListItem>
          <ListItem>
            <strong>🔴 Cell Styling:</strong> Fixed cell shapes and borders
          </ListItem>
          <ListItem>
            <strong>🔴 Tooltip Content:</strong> Basic tooltip with limited customization
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
