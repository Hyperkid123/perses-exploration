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
const query = 'avg(rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100';

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
                kind: 'GaugeChart',
                spec: {
                  calculation: 'last', // 'last', 'mean', 'max', 'min', 'sum'
                  max: 100, // Maximum value for gauge scale
                  format: {
                    unit: 'percent', // Unit formatting
                    decimalPlaces: 1, // Number precision
                    shortValues: false, // Use short notation (1k vs 1000)
                  },
                  thresholds: {
                    defaultColor: '#3e8635', // PatternFly success green
                    steps: [
                      { value: 60, color: '#06c' }, // PatternFly primary blue
                      { value: 75, color: '#f0ab00' }, // PatternFly warning yellow
                      { value: 90, color: '#c9190b' }, // PatternFly danger red
                    ],
                  },
                  legend: {
                    show: true, // Display legend
                  },
                },
              },
            },
          }}
        />
      </DataQueriesProvider>
    </div>
  );
};

const PersesGaugeChart = () => {
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
        <Content>GaugeChart Available Configuration Options:</Content>
        <List>
          <ListItem>✅ <strong>calculation:</strong> &lsquo;last&rsquo;, &lsquo;mean&rsquo;, &lsquo;max&rsquo;, &lsquo;min&rsquo;, &lsquo;sum&rsquo; - Data aggregation method</ListItem>
          <ListItem>✅ <strong>max:</strong> number - Maximum value for gauge scale (default: 100)</ListItem>
          <ListItem>✅ <strong>format:</strong> Unit, decimal places, short values configuration</ListItem>
          <ListItem>✅ <strong>thresholds:</strong> Color-coded value ranges with custom colors</ListItem>
          <ListItem>✅ <strong>legend:</strong> Show/hide legend display</ListItem>
        </List>
        <Content>PatternFly Integration Capabilities:</Content>
        <List>
          <ListItem>✅ <strong>Color Palette:</strong> Full control over threshold colors using PatternFly palette</ListItem>
          <ListItem>✅ <strong>Typography:</strong> Inherits PatternFly fonts via CSS variables</ListItem>
          <ListItem>✅ <strong>Theme Integration:</strong> Uses chartsTheme.echartsTheme.gauge for styling</ListItem>
          <ListItem>✅ <strong>Threshold Styling:</strong> PatternFly semantic colors (success, warning, danger)</ListItem>
        </List>
        <Content>Current PatternFly Configuration:</Content>
        <List>
          <ListItem>Default: #3e8635 (PatternFly success green)</ListItem>
          <ListItem>60%+: #06c (PatternFly primary blue)</ListItem>
          <ListItem>75%+: #f0ab00 (PatternFly warning yellow)</ListItem>
          <ListItem>90%+: #c9190b (PatternFly danger red)</ListItem>
        </List>
        <Content>Advanced PatternFly Styling via ChartsTheme:</Content>
        <List>
          <ListItem>✅ <strong>Gauge Appearance:</strong> Configure via chartsTheme.echartsTheme.gauge</ListItem>
          <ListItem>✅ <strong>Arc Styling:</strong> Custom arc width, colors, and gradients</ListItem>
          <ListItem>✅ <strong>Pointer Styling:</strong> Custom needle/pointer appearance</ListItem>
          <ListItem>✅ <strong>Label Formatting:</strong> Custom text styling and positioning</ListItem>
        </List>
        <Content>Limitations:</Content>
        <List>
          <ListItem>❌ <strong>CSS Variables:</strong> Cannot use PatternFly CSS variables directly - requires hex codes</ListItem>
          <ListItem>❌ <strong>Inner Shape Styling:</strong> Limited access to internal SVG elements</ListItem>
          <ListItem>❌ <strong>Animation Control:</strong> No direct animation configuration</ListItem>
          <ListItem>❌ <strong>Custom Tick Marks:</strong> Limited tick customization options</ListItem>
          <ListItem>⚠️ <strong>Theme Sync:</strong> Colors must be manually updated when PatternFly theme changes</ListItem>
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

export default PersesGaugeChart;
