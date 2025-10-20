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
                          link: '/logs?filter=url:{value}',
                        },
                      ],
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
        <Content>TracingGanttChart Available Configuration Options:</Content>
        <List>
          <ListItem>
            ✅ <strong>visual:</strong> TracingGanttChartVisualOptions (optional) - Visual customization options
          </ListItem>
          <ListItem>
            ✅ <strong>links:</strong> TracingGanttChartCustomLinks (optional) - Custom link configuration
          </ListItem>
          <ListItem>
            ✅ <strong>selectedSpanId:</strong> string (optional) - Initially selected span ID
          </ListItem>
        </List>
        <Content>Visual Options (visual property):</Content>
        <List>
          <ListItem>
            ✅ <strong>palette:</strong> TracingGanttChartPaletteOptions - Color palette configuration (&lsquo;auto&rsquo; or &lsquo;categorical&rsquo;)
          </ListItem>
        </List>
        <Content>Link Options (links property):</Content>
        <List>
          <ListItem>
            ✅ <strong>trace:</strong> string - Custom trace link template with variables (traceId, datasourceName)
          </ListItem>
          <ListItem>
            ✅ <strong>span:</strong> string - Custom span link template with variables (traceId, spanId, datasourceName)
          </ListItem>
          <ListItem>
            ✅ <strong>attributes:</strong> TracingGanttChartCustomAttributeLink[] - Custom attribute-specific links
          </ListItem>
        </List>
        <Content>Current Configuration:</Content>
        <List>
          <ListItem>visual.palette.mode: &lsquo;categorical&rsquo;</ListItem>
          <ListItem>links.trace: &lsquo;/traces/&#123;traceId&#125;?datasource=&#123;datasourceName&#125;&rsquo;</ListItem>
          <ListItem>links.span: &lsquo;/traces/&#123;traceId&#125;/spans/&#123;spanId&#125;?datasource=&#123;datasourceName&#125;&rsquo;</ListItem>
          <ListItem>links.attributes: Custom http.url attribute link configured</ListItem>
          <ListItem>selectedSpanId: &lsquo;span1001&rsquo; - Initial span focus</ListItem>
        </List>
        <Content>Built-in Capabilities:</Content>
        <List>
          <ListItem>
            ✅ <strong>Timeline Visualization:</strong> Interactive Gantt chart for trace spans
          </ListItem>
          <ListItem>
            ✅ <strong>Span Hierarchy:</strong> Visual representation of span parent-child relationships
          </ListItem>
          <ListItem>
            ✅ <strong>Interactive Navigation:</strong> Click-to-navigate with variable substitution
          </ListItem>
          <ListItem>
            ✅ <strong>Span Selection:</strong> Configurable initial span focus
          </ListItem>
          <ListItem>
            ✅ <strong>Attribute Links:</strong> Custom links for specific span attributes
          </ListItem>
          <ListItem>
            ✅ <strong>Timeline Controls:</strong> Built-in zoom and pan functionality
          </ListItem>
        </List>
        <Content>PatternFly Integration Challenges:</Content>
        <List>
          <ListItem>
            ❌ <strong>Complex Component Structure:</strong> Uses specialized Gantt chart components, not PatternFly
          </ListItem>
          <ListItem>
            ❌ <strong>Theme Conflicts:</strong> Requires isolated ThemeProvider to avoid PatternFly CSS conflicts
          </ListItem>
          <ListItem>
            ❌ <strong>Fixed Gantt Layout:</strong> Cannot replace with PatternFly timeline components
          </ListItem>
          <ListItem>
            ⚠️ <strong>Limited Theme Integration:</strong> Basic theme isolation with createTheme override
          </ListItem>
        </List>
        <Content>Limitations:</Content>
        <List>
          <ListItem>
            ❌ <strong>Timeline Orientation:</strong> No horizontal/vertical toggle options
          </ListItem>
          <ListItem>
            ❌ <strong>Color Schemes:</strong> Limited to palette mode options (&lsquo;auto&rsquo; or &lsquo;categorical&rsquo;)
          </ListItem>
          <ListItem>
            ❌ <strong>Legend Formatting:</strong> No custom legend controls
          </ListItem>
          <ListItem>
            ❌ <strong>Span Visualization:</strong> No custom span appearance options
          </ListItem>
          <ListItem>
            ❌ <strong>Layout Configuration:</strong> No timeline layout customization
          </ListItem>
          <ListItem>
            ❌ <strong>Filtering Options:</strong> No built-in span filtering
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

export default PersesTracingGanttChart;
