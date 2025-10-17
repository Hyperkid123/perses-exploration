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
          </Grid>
        </div>
      </PluginRegistry>
    </ThemeProvider>
  );
}

export default App;
