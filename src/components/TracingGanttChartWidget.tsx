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
import { useTheme } from '../hooks/useTheme';

const start = '2023-10-01T00:00:00Z';
const end = '2023-10-01T01:00:00Z';
const query = 'abc123def456'; // Direct trace ID to get data.trace instead of data.searchResult

// Function to create theme-aware MUI theme for Perses compatibility
const createBasicTheme = (theme: 'light' | 'dark') => {
  const isDark = theme === 'dark';

  return createTheme({
    palette: {
      mode: theme,
      primary: {
        main: '#0066cc', // PatternFly brand blue equivalent
      },
      secondary: {
        main: '#c9190b', // PatternFly danger red equivalent
      },
      background: {
        default: isDark ? '#1f1f1f' : '#fafafa', // PatternFly background
        paper: isDark ? '#2a2a2a' : '#ffffff', // PatternFly background white/dark
      },
      text: {
        primary: isDark ? '#ffffff' : '#151515', // PatternFly text regular
        secondary: isDark ? '#c7c7c7' : '#6a6e73', // PatternFly text subtle
      },
    },
    components: {
      // Ensure DataGrid uses PatternFly-aligned colors
      MuiTableCell: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
            borderBottom: isDark ? '1px solid #4a4a4a' : '1px solid #d2d2d2',
            color: isDark ? '#ffffff' : '#151515',
          },
        },
      },
    },
  });
};

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
  const { theme } = useTheme();
  const basicTheme = createBasicTheme(theme);
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
  const timeRange = useTimeRange();

  const sections = [
    {
      id: 'customization',
      title: 'Customization Options',
      content: (
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
          <ListItem>
            ✅ <strong>visual.palette:</strong> TracingGanttChartPaletteOptions - Color palette configuration (&lsquo;auto&rsquo; or &lsquo;categorical&rsquo;)
          </ListItem>
          <ListItem>
            ✅ <strong>links.trace:</strong> string - Custom trace link template with variables (traceId, datasourceName)
          </ListItem>
          <ListItem>
            ✅ <strong>links.span:</strong> string - Custom span link template with variables (traceId, spanId, datasourceName)
          </ListItem>
          <ListItem>
            ✅ <strong>links.attributes:</strong> TracingGanttChartCustomAttributeLink[] - Custom attribute-specific links
          </ListItem>
          <ListItem>
            ✅ <strong>Current Configuration:</strong> visual.palette.mode: &lsquo;categorical&rsquo;, links.trace:
            &lsquo;/traces/&#123;traceId&#125;?datasource=&#123;datasourceName&#125;&rsquo;, links.span:
            &lsquo;/traces/&#123;traceId&#125;/spans/&#123;spanId&#125;?datasource=&#123;datasourceName&#125;&rsquo;, links.attributes: Custom http.url
            attribute link configured, selectedSpanId: &lsquo;span1001&rsquo; - Initial span focus
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
      ),
    },
    {
      id: 'patternfly',
      title: 'PatternFly Integration',
      content: (
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
      ),
    },
    {
      id: 'limitations',
      title: 'Limitations',
      content: (
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
      ),
    },
  ];

  return (
    <WidgetCard title='TracingGanttChart Widget' sections={sections}>
      <PersesWidgetWrapper>
        <TimeRangeProvider timeRange={timeRange} refreshInterval='0s'>
          <TimeSeries />
        </TimeRangeProvider>
      </PersesWidgetWrapper>
    </WidgetCard>
  );
};

export default PersesTracingGanttChart;
