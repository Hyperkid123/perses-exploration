import { useMemo, useRef, useState } from 'react';
import { AbsoluteTimeRange, RelativeTimeRange, TimeRangeValue } from '@perses-dev/core';
import { Panel } from '@perses-dev/dashboards';
import { DataQueriesProvider, TimeRangeProvider, useQueryType, useSuggestedStepMs } from '@perses-dev/plugin-system';
import { DEFAULT_PYROSCOPE } from '@perses-dev/pyroscope-plugin';
import useResizeObserver from 'use-resize-observer';
import PersesWidgetWrapper from './PersesWrapper';
import { Box, ListItem } from '@mui/material';
import { Content, List, Switch } from '@patternfly/react-core';

const start = '2023-10-01T00:00:00Z';
const end = '2023-10-01T01:00:00Z';

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
  const datasource = DEFAULT_PYROSCOPE;
  const panelRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver({ ref: panelRef });
  const suggestedStepMs = useSuggestedStepMs(width);

  const definitions = [
    {
      kind: 'PyroscopeProfileQuery',
      spec: {
        datasource: {
          kind: datasource.kind,
          name: datasource.name,
        },
        profileType: 'process_cpu:cpu:nanoseconds:cpu:nanoseconds',
        service: 'pyroscope',
        maxNodes: 1024,
        filters: [],
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
              display: { name: 'Foo' },
              plugin: {
                kind: 'FlameChart',
                spec: {
                  showFlameGraph: true,
                  showTable: false,
                  showSettings: true,
                  showSeries: true,
                  palette: 'package-name',
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesFlameChart = () => {
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
        <Content>Customization issues:</Content>
        <List>
          <ListItem>
            Customization of composite pieces is limited. We won&apost;t be able to use for example PF table or style the table directly as there is no API. We
            could use some complex CSS rules/overrides but that is brittle
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

export default PersesFlameChart;
