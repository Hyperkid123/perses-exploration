import '@patternfly/react-core/dist/styles/base.css';
import { Layout as LayoutDef } from 'react-grid-layout';
import { ThemeProvider } from '@mui/material';
import { Content } from '@patternfly/react-core';
import PersesPieChart from './components/PieChartWidget';
import { usePatternFlyTheme } from './hooks/usePatternflyTheme';
import PersesBarChart from './components/BarChartWidget';
import PersesFlameChart from './components/FlameChartWidget';
import { PluginRegistry } from '@perses-dev/plugin-system';
import { pluginLoader } from './perses/pluginLoader';
import PersesGaugeChart from './components/GaugeChartWidget';
import PersesHeatMapChart from './components/HeatMapChartWidget';
import PersesHistogramChart from './components/HistogramChartWidget';
import PersesScatterChart from './components/ScatterChartWidget';
import PersesStatChart from './components/StatChartWidget';
import PersesStatusHistoryChart from './components/StatusHistoryChartWidget';
import PersesTimeSeriesChart from './components/TimeSeriesChartWidget';
import PersesTimeSeriesTable from './components/TimeSeriesTableWidget';
import PersesTraceTable from './components/TraceTableWidget';
import PersesTracingGanttChart from './components/TracingGanttChartWidget';
import Layout from './layout/Layout';
import { ComponentType, useState } from 'react';

import 'react-grid-layout/css/styles.css';

function App() {
  const theme = usePatternFlyTheme();
  const [layout, setLayout] = useState<(LayoutDef & { C: ComponentType })[]>([
    {
      i: 'PersesBarChart',
      x: 0,
      y: 0,
      w: 6,
      h: 5,
      C: PersesBarChart,
    },
    {
      i: 'PersesFlameChart',
      x: 6,
      y: 0,
      w: 6,
      h: 5,
      C: PersesFlameChart,
    },
    {
      i: 'PersesGaugeChart',
      x: 0,
      y: 5,
      w: 6,
      h: 5,
      C: PersesGaugeChart,
    },
    {
      i: 'PersesHeatMapChart',
      x: 6,
      y: 5,
      w: 6,
      h: 5,
      C: PersesHeatMapChart,
    },
    {
      i: 'PersesHistogramChart',
      x: 0,
      y: 10,
      w: 6,
      h: 5,
      C: PersesHistogramChart,
    },
    {
      i: 'PersesPieChart',
      x: 6,
      y: 10,
      w: 6,
      h: 5,
      C: PersesPieChart,
    },
    {
      i: 'PersesScatterChart',
      x: 0,
      y: 15,
      w: 6,
      h: 5,
      C: PersesScatterChart,
    },
    {
      i: 'PersesStatChart',
      x: 6,
      y: 15,
      w: 6,
      h: 5,
      C: PersesStatChart,
    },
    {
      i: 'PersesStatusHistoryChart',
      x: 0,
      y: 20,
      w: 6,
      h: 5,
      C: PersesStatusHistoryChart,
    },
    {
      i: 'PersesTimeSeriesChart',
      x: 6,
      y: 20,
      w: 6,
      h: 5,
      C: PersesTimeSeriesChart,
    },
    {
      i: 'PersesTimeSeriesTable',
      x: 0,
      y: 25,
      w: 6,
      h: 5,
      C: PersesTimeSeriesTable,
    },
    {
      i: 'PersesTraceTable',
      x: 6,
      y: 25,
      w: 6,
      h: 5,
      C: PersesTraceTable,
    },
    {
      i: 'PersesTracingGanttChart',
      x: 0,
      y: 30,
      w: 6,
      h: 5,
      C: PersesTracingGanttChart,
    },
  ]);

  const handleLayoutChange = (newLayout: (LayoutDef & { C: ComponentType })[]) => {
    setLayout(newLayout);
  };

  return (
    <ThemeProvider theme={theme}>
      <PluginRegistry
        pluginLoader={pluginLoader}
        defaultPluginKinds={{
          Panel: 'TimeSeriesChart',
          TimeSeriesQuery: 'PrometheusTimeSeriesQuery',
        }}
      >
        <div>
          <Content>
            Checking plugins used in the{' '}
            <a
              href='https://github.com/openshift/monitoring-plugin/blob/main/web/src/components/dashboards/perses/persesPluginsLoader.tsx'
              target='_blank'
              rel='noreferrer'
            >
              monitoring plugin in OCP
            </a>
            .
          </Content>
        </div>
        <div>
          <Layout layout={layout} onLayoutChange={handleLayoutChange} />
        </div>
      </PluginRegistry>
    </ThemeProvider>
  );
}

export default App;
