import { PropsWithChildren } from 'react';

import { ChartsProvider, SnackbarProvider } from '@perses-dev/components';
import { TimeRangeProvider } from '@perses-dev/plugin-system';
import { generateChartsTheme, getTheme } from '@perses-dev/components';
import { QueryClientProvider } from '@tanstack/react-query';
import * as prometheusPlugin from '@perses-dev/prometheus-plugin';

import { fakeDatasourceApi, queryClient } from '../perses/dataSourceApi';
import { DatasourceStoreProvider, VariableProvider } from '@perses-dev/dashboards';

const persesTimeRange = {
  pastDuration: '1h' as prometheusPlugin.DurationString,
};

const muiTheme = getTheme('light');

// Custom charts theme with PatternFly colors and enhanced styling
const chartsTheme = generateChartsTheme(muiTheme, {
  // Override the default ECharts theme
  echartsTheme: {
    // Custom color palette for better visual variety
    color: [
      '#06c', // PatternFly primary blue
      '#3e8635', // PatternFly green
      '#f0ab00', // PatternFly yellow/orange
      '#c9190b', // PatternFly red
      '#8b43d6', // PatternFly purple
      '#009596', // PatternFly cyan
      '#d2691e', // Custom orange
    ],
    // Tooltip styling
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#06c',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
    // Grid styling
    grid: {
      top: 40,
      right: 40,
      bottom: 60,
      left: 60,
      containLabel: true,
    },
    // Bar chart specific styling for PatternFly appearance
    bar: {
      itemStyle: {
        borderRadius: [2, 2, 0, 0], // Rounded top corners - PatternFly style
        borderWidth: 0,
      },
      emphasis: {
        itemStyle: {
          borderRadius: [2, 2, 0, 0],
          shadowBlur: 5,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
        },
      },
      barMaxWidth: 50, // Maximum bar width for better appearance
      barGap: '20%', // Gap between bars in same category
      barCategoryGap: '40%', // Gap between categories
    },
  },
  // Custom threshold colors for status indicators
  thresholds: {
    defaultColor: '#3e8635', // PatternFly green for success
    palette: ['#f0ab00', '#fe5d00', '#c9190b'], // PatternFly warning, orange, danger
  },
  // Sparkline customization
  sparkline: {
    width: 3,
    color: '#06c', // PatternFly primary blue
  },
});

const PersesWidgetWrapper = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <ChartsProvider chartsTheme={chartsTheme}>
      <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='default' content=''>
        <QueryClientProvider client={queryClient}>
          <TimeRangeProvider timeRange={persesTimeRange}>
            <VariableProvider>
              <DatasourceStoreProvider datasourceApi={fakeDatasourceApi}>{children}</DatasourceStoreProvider>
            </VariableProvider>
          </TimeRangeProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ChartsProvider>
  );
};

export default PersesWidgetWrapper;
