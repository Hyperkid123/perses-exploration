import { useMemo, useRef, useState } from 'react';
import { AbsoluteTimeRange, RelativeTimeRange, TimeRangeValue } from '@perses-dev/core';
import { Panel } from '@perses-dev/dashboards';
import { DataQueriesProvider, TimeRangeProvider, useSuggestedStepMs } from '@perses-dev/plugin-system';
import { DEFAULT_TEMPO } from '@perses-dev/tempo-plugin';
import useResizeObserver from 'use-resize-observer';
import PersesWidgetWrapper from './PersesWrapper';
import { Box, ListItem, ThemeProvider, createTheme } from '@mui/material';
import { Content, List, Switch } from '@patternfly/react-core';

const start = '2023-10-01T00:00:00Z';
const end = '2023-10-01T01:00:00Z';
const query = '{service.name=~".*service"} | avg(duration) > 100ms';

// Basic MUI theme without PatternFly CSS variables to avoid conflicts
const basicTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  components: {
    // Ensure DataGrid uses standard colors
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
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
        <Content>TraceTable Available Configuration Options:</Content>
        <List>
          <ListItem>
            ✅ <strong>visual:</strong> TraceTableVisualOptions (optional) - Visual customization options
          </ListItem>
          <ListItem>
            ✅ <strong>links:</strong> TraceTableCustomLinks (optional) - Custom link configuration
          </ListItem>
        </List>
        <Content>Visual Options (visual property):</Content>
        <List>
          <ListItem>
            ✅ <strong>palette:</strong> TraceTablePaletteOptions - Color palette configuration (&lsquo;auto&rsquo; or &lsquo;categorical&rsquo;)
          </ListItem>
        </List>
        <Content>Link Options (links property):</Content>
        <List>
          <ListItem>
            ✅ <strong>trace:</strong> string - Custom trace link template with variables (traceId, datasourceName)
          </ListItem>
        </List>
        <Content>Current Configuration:</Content>
        <List>
          <ListItem>visual.palette.mode: &lsquo;categorical&rsquo;</ListItem>
          <ListItem>
            links.trace: &lsquo;/traces/{`{traceId}`}?datasource={`{datasourceName}`}&rsquo;
          </ListItem>
          <ListItem>query: &lsquo;{`{service.name=~".*service"}`} | avg(duration) &gt; 100ms&rsquo;</ListItem>
        </List>
        <Content>Built-in Capabilities:</Content>
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
        <Content>PatternFly Integration Challenges:</Content>
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
        <Content>Major Limitations:</Content>
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

export default PersesTraceTable;
