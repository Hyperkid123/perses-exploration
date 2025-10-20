import { useMemo, useRef } from 'react';
import { AbsoluteTimeRange, RelativeTimeRange, TimeRangeValue } from '@perses-dev/core';
import { Panel } from '@perses-dev/dashboards';
import { DataQueriesProvider, TimeRangeProvider, useSuggestedStepMs } from '@perses-dev/plugin-system';
import { DEFAULT_PYROSCOPE } from '@perses-dev/pyroscope-plugin';
import useResizeObserver from 'use-resize-observer';
import PersesWidgetWrapper from './PersesWrapper';
import WidgetCard from './WidgetCard';
import { List, ListItem } from '@patternfly/react-core';

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
                  palette: 'package-name', // 'package-name' | 'value'
                  showSettings: true, // Show settings panel
                  showSeries: true, // Show series information
                  showTable: false, // Hide data table view
                  showFlameGraph: true, // Show flame graph visualization
                  // traceHeight: 200, // Optional custom height
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
  const timeRange = useTimeRange();

  const sections = [
    {
      id: 'customization',
      title: 'Customization Options',
      content: (
        <List>
          <ListItem>
            ✅ <strong>palette:</strong> &lsquo;package-name&rsquo; | &lsquo;value&rsquo; - Color scheme for flame graph
          </ListItem>
          <ListItem>
            ✅ <strong>showSettings:</strong> boolean - Display settings panel
          </ListItem>
          <ListItem>
            ✅ <strong>showSeries:</strong> boolean - Show series information
          </ListItem>
          <ListItem>
            ✅ <strong>showTable:</strong> boolean - Display data table view
          </ListItem>
          <ListItem>
            ✅ <strong>showFlameGraph:</strong> boolean - Show flame graph visualization
          </ListItem>
          <ListItem>
            ✅ <strong>traceHeight:</strong> number (optional) - Custom height for trace visualization
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
            ⚠️ <strong>Theme Integration:</strong> Limited to overall container theming
          </ListItem>
          <ListItem>
            ❌ <strong>Composite Components:</strong> Limited customization of internal table/graph pieces
          </ListItem>
          <ListItem>
            ❌ <strong>PatternFly Table:</strong> Cannot directly style internal table with PF components
          </ListItem>
          <ListItem>
            ❌ <strong>CSS Override Requirement:</strong> Would need brittle CSS rules for PF styling
          </ListItem>
        </List>
      ),
    },
  ];

  return (
    <WidgetCard title='FlameChart Widget' sections={sections}>
      <PersesWidgetWrapper>
        <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
          <TimeSeries />
        </TimeRangeProvider>
      </PersesWidgetWrapper>
    </WidgetCard>
  );
};

export default PersesFlameChart;
