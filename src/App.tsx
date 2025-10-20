import '@patternfly/react-core/dist/styles/base.css';
import { ThemeProvider } from '@mui/material';
import { Content, Grid, GridItem } from '@patternfly/react-core';
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

function App() {
  const theme = usePatternFlyTheme();
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
          <Grid hasGutter>
            <GridItem span={3}>
              <PersesPieChart />
            </GridItem>
            <GridItem span={3}>
              <PersesBarChart />
            </GridItem>
            <GridItem span={3}>
              <PersesFlameChart />
            </GridItem>
            <GridItem span={3}>
              <PersesGaugeChart />
            </GridItem>
            <GridItem span={3}>
              <PersesHeatMapChart />
            </GridItem>
            <GridItem span={3}>
              <PersesHistogramChart />
            </GridItem>
            <GridItem span={3}>
              <PersesScatterChart />
            </GridItem>
            <GridItem span={3}>
              <PersesStatChart />
            </GridItem>
            <GridItem span={3}>
              <PersesStatusHistoryChart />
            </GridItem>
            <GridItem span={3}>
              <PersesTimeSeriesChart />
            </GridItem>
            <GridItem span={6}>
              <PersesTimeSeriesTable />
            </GridItem>
            <GridItem span={6}>
              <PersesTraceTable />
            </GridItem>
            <GridItem span={6}>
              <PersesTracingGanttChart />
            </GridItem>
          </Grid>
        </div>
      </PluginRegistry>
    </ThemeProvider>
  );
}

export default App;
