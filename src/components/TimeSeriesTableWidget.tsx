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
                  // TimeSeriesTable has NO customization options available
                  // The TimeSeriesTableOptions interface is completely empty
                  // All configuration is handled automatically by the plugin
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
  const timeRange = useTimeRange();

  const sections = [
    {
      id: 'customization',
      title: 'Customization Options',
      content: (
        <List>
          <ListItem>
            ❌ <strong>NO Configuration Options:</strong> TimeSeriesTableOptions interface is completely empty
          </ListItem>
          <ListItem>
            ❌ <strong>Zero Customization:</strong> All behavior is hard-coded in the plugin
          </ListItem>
        </List>
      ),
    },
    {
      id: 'capabilities',
      title: 'Built-in Capabilities',
      content: (
        <List>
          <ListItem>
            ✅ <strong>Automatic Data Formatting:</strong> Timestamps and values formatted automatically
          </ListItem>
          <ListItem>
            ✅ <strong>Two-Column Layout:</strong> Fixed metric names + values structure
          </ListItem>
          <ListItem>
            ✅ <strong>Scrollable Container:</strong> Uses MUI table with automatic scrolling
          </ListItem>
          <ListItem>
            ✅ <strong>Series Display Limit:</strong> Maximum 1000 series for performance
          </ListItem>
          <ListItem>
            ✅ <strong>Data Aggregation:</strong> Uses last value from time series data
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
            ❌ <strong>No PatternFly Table:</strong> Uses MUI Table components exclusively
          </ListItem>
          <ListItem>
            ❌ <strong>Fixed Styling:</strong> Cannot replace with PatternFly table styling
          </ListItem>
          <ListItem>
            ⚠️ <strong>Limited Theme Integration:</strong> Only inherits basic typography via CSS variables
          </ListItem>
          <ListItem>
            ⚠️ <strong>MUI Dependency:</strong> Heavily dependent on Material-UI table components
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
            ❌ <strong>No Configuration Interface:</strong> Cannot customize any aspect of the table
          </ListItem>
          <ListItem>
            ❌ <strong>Column Configuration:</strong> No custom columns or column visibility controls
          </ListItem>
          <ListItem>
            ❌ <strong>Sorting/Filtering:</strong> No built-in sorting or filtering options
          </ListItem>
          <ListItem>
            ❌ <strong>Pagination:</strong> No pagination controls for large datasets
          </ListItem>
          <ListItem>
            ❌ <strong>Row Limits:</strong> No configurable row limits or virtualization
          </ListItem>
          <ListItem>
            ❌ <strong>Header Customization:</strong> Uses default MUI table headers
          </ListItem>
          <ListItem>
            ❌ <strong>Cell Styling:</strong> No custom cell renderers or styling options
          </ListItem>
        </List>
      ),
    },
  ];

  return (
    <WidgetCard title='TimeSeriesTable Widget' sections={sections}>
      <PersesWidgetWrapper>
        <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
          <TimeSeries />
        </TimeRangeProvider>
      </PersesWidgetWrapper>
    </WidgetCard>
  );
};

export default PersesTimeSeriesTable;
