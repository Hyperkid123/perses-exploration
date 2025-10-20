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
const query = 'abc123def456'; // Direct trace ID to get data.trace instead of data.searchResult

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
                  kind: 'TracingGanttChart',
                  spec: {
                    // Visual customization options
                    visual: {
                      palette: {
                        mode: 'categorical', // 'auto' or 'categorical'
                      },
                    },
                    // Custom linking options
                    links: {
                      trace: '/traces/{traceId}?datasource={datasourceName}',
                      span: '/traces/{traceId}/spans/{spanId}?datasource={datasourceName}',
                      attributes: [
                        {
                          name: 'http.url',
                          link: '/logs?filter=url:{value}'
                        }
                      ]
                    },
                    // Initial span selection
                    selectedSpanId: 'span1001',
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

const PersesTracingGanttChart = () => {
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
        <Content>TracingGanttChart Customization Options:</Content>
        <List>
          <ListItem>✅ Palette Mode: 'auto' or 'categorical' color schemes</ListItem>
          <ListItem>✅ Custom Links: Trace, span, and attribute-specific links</ListItem>
          <ListItem>✅ Link Variables: {'{traceId}'}, {'{spanId}'}, {'{datasourceName}'}, {'{value}'}</ListItem>
          <ListItem>✅ Initial Selection: Set selectedSpanId for default focus</ListItem>
          <ListItem>✅ Theme Integration: Uses Perses charts theme automatically</ListItem>
          <ListItem>✅ Attribute Links: Custom links for specific span attributes</ListItem>
        </List>
        <Content>Customization Limitations:</Content>
        <List>
          <ListItem>❌ Timeline Orientation: No horizontal/vertical toggle</ListItem>
          <ListItem>❌ Zoom Controls: No built-in zoom configuration</ListItem>
          <ListItem>❌ Color Schemes: Limited to palette mode options</ListItem>
          <ListItem>❌ Legend Formatting: No custom legend controls</ListItem>
          <ListItem>❌ Span Visualization: No custom span appearance options</ListItem>
          <ListItem>❌ Layout Configuration: No timeline layout customization</ListItem>
          <ListItem>❌ Filtering Options: No built-in span filtering</ListItem>
          <ListItem>⚠️ Advanced Styling: Requires external CSS/theming</ListItem>
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

export default PersesTracingGanttChart;
