import { useMemo, useRef } from 'react';
import { AbsoluteTimeRange, RelativeTimeRange, TimeRangeValue } from '@perses-dev/core';
import { Panel } from '@perses-dev/dashboards';
import { DataQueriesProvider, TimeRangeProvider, useSuggestedStepMs } from '@perses-dev/plugin-system';
import { DEFAULT_TEMPO } from '@perses-dev/tempo-plugin';
import useResizeObserver from 'use-resize-observer';
import PersesWidgetWrapper from './PersesWrapper';
import WidgetCard from './WidgetCard';
import { ThemeProvider, createTheme } from '@mui/material';
import { List, ListItem } from '@patternfly/react-core';

const start = '2023-10-01T00:00:00Z';
const end = '2023-10-01T01:00:00Z';
const query = '{service.name=~".*service"} | avg(duration) > 100ms';

// Basic MUI theme using PatternFly-aligned colors to avoid conflicts
const basicTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0066cc', // PatternFly brand blue equivalent
    },
    secondary: {
      main: '#c9190b', // PatternFly danger red equivalent
    },
    background: {
      default: '#fafafa', // PatternFly background-100 equivalent
      paper: '#ffffff', // PatternFly background white
    },
    text: {
      primary: '#151515', // PatternFly text regular equivalent
      secondary: '#6a6e73', // PatternFly text subtle equivalent
    },
  },
  components: {
    // Ensure DataGrid uses PatternFly-aligned colors
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #d2d2d2', // PatternFly border-100 equivalent
        },
      },
    },
  },
});

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
        <ThemeProvider theme={basicTheme}>
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
                  kind: 'TraceTable',
                  spec: {
                    visual: {
                      palette: {
                        mode: 'categorical', // 'auto' or 'categorical'
                      },
                    },
                    links: {
                      trace: '/traces/{traceId}?datasource={datasourceName}', // Custom trace link with variables
                    },
                  },
                },
              },
            }}
          />
        </ThemeProvider>
      </DataQueriesProvider>
    </div>
  );
};

const PersesTraceTable = () => {
  const timeRange = useTimeRange();

  const sections = [
    {
      id: 'customization',
      title: 'Customization Options',
      content: (
        <List>
          <ListItem>
            ✅ <strong>visual:</strong> TraceTableVisualOptions (optional) - Visual customization options
          </ListItem>
          <ListItem>
            ✅ <strong>links:</strong> TraceTableCustomLinks (optional) - Custom link configuration
          </ListItem>
          <ListItem>
            ✅ <strong>visual.palette:</strong> TraceTablePaletteOptions - Color palette configuration (&lsquo;auto&rsquo; or &lsquo;categorical&rsquo;)
          </ListItem>
          <ListItem>
            ✅ <strong>links.trace:</strong> string - Custom trace link template with variables (traceId, datasourceName)
          </ListItem>
          <ListItem>
            ✅ <strong>Current Configuration:</strong> visual.palette.mode: &lsquo;categorical&rsquo;, links.trace: &lsquo;/traces/{`{traceId}`}?datasource=
            {`{datasourceName}`}&rsquo;, query: &lsquo;{`{service.name=~".*service"}`} | avg(duration) &gt; 100ms&rsquo;
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
            ✅ <strong>DataGrid Display:</strong> Uses MUI DataGrid for tabular trace display
          </ListItem>
          <ListItem>
            ✅ <strong>Interactive Links:</strong> Click-to-navigate trace details with variable substitution
          </ListItem>
          <ListItem>
            ✅ <strong>Automatic Columns:</strong> Fixed columns for trace data (Service, Operation, Duration, etc.)
          </ListItem>
          <ListItem>
            ✅ <strong>Color Coding:</strong> Configurable color palette for trace visualization
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
            ❌ <strong>MUI DataGrid Dependency:</strong> Uses MUI DataGrid exclusively, cannot use PatternFly tables
          </ListItem>
          <ListItem>
            ❌ <strong>Theme Conflicts:</strong> Requires isolated ThemeProvider to avoid PatternFly CSS conflicts
          </ListItem>
          <ListItem>
            ❌ <strong>Fixed Table Structure:</strong> Cannot replace with PatternFly Table components
          </ListItem>
          <ListItem>
            ⚠️ <strong>Limited Theme Integration:</strong> Basic theme isolation with createTheme override
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
            ❌ <strong>Column Configuration:</strong> No custom column controls or visibility options
          </ListItem>
          <ListItem>
            ❌ <strong>Table Styling:</strong> Limited styling beyond basic theme colors
          </ListItem>
          <ListItem>
            ❌ <strong>Row Display Options:</strong> No row height, density, or layout controls
          </ListItem>
          <ListItem>
            ❌ <strong>Advanced Filtering:</strong> No built-in filtering or search options
          </ListItem>
          <ListItem>
            ❌ <strong>Custom Data Formatters:</strong> Limited cell rendering and formatting control
          </ListItem>
          <ListItem>
            ❌ <strong>CSS Variables:</strong> Cannot use PatternFly CSS variables due to theme isolation
          </ListItem>
        </List>
      ),
    },
  ];

  return (
    <WidgetCard title='TraceTable Widget' sections={sections}>
      <PersesWidgetWrapper>
        <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
          <TimeSeries />
        </TimeRangeProvider>
      </PersesWidgetWrapper>
    </WidgetCard>
  );
};

export default PersesTraceTable;
