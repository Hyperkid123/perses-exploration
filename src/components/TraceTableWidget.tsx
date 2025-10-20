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
                    // Visual customization options
                    sizeRange: [8, 30], // Point size range for scatter plot visualization
                    link: '/traces/{traceId}?datasource={datasourceName}', // Custom link template
                    palette: {
                      mode: 'categorical', // 'auto' or 'categorical'
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
        <Content>TraceTable Customization Options:</Content>
        <List>
          <ListItem>✅ Size Range: Configure point sizes [min, max] for scatter visualization</ListItem>
          <ListItem>✅ Link Template: Custom trace link patterns with variables</ListItem>
          <ListItem>✅ Palette Mode: 'auto' or 'categorical' color selection</ListItem>
          <ListItem>✅ Theme Integration: Uses Perses charts theme automatically</ListItem>
          <ListItem>✅ DataGrid Styling: Standard MUI DataGrid appearance</ListItem>
        </List>
        <Content>Customization Limitations:</Content>
        <List>
          <ListItem>❌ Column Configuration: No custom column controls</ListItem>
          <ListItem>❌ Table Styling: Limited beyond theme colors</ListItem>
          <ListItem>❌ Row Display Options: No row height or density controls</ListItem>
          <ListItem>❌ Advanced Filtering: No built-in filter options</ListItem>
          <ListItem>❌ Custom Data Formatters: Limited formatting control</ListItem>
          <ListItem>⚠️ Theme Conflict: Requires isolated ThemeProvider with PatternFly</ListItem>
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
