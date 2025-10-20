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

// Custom charts theme with PatternFly-aligned colors
// Note: ECharts doesn't support CSS variables, so we use hex values that match PatternFly tokens
const chartsTheme = generateChartsTheme(muiTheme, {
  // Override the default ECharts theme
  echartsTheme: {
    // Custom color palette matching PatternFly design tokens
    color: [
      '#0066cc', // PatternFly --pf-t--global--color--brand--default
      '#3e8635', // PatternFly --pf-t--global--color--success--default
      '#f0ab00', // PatternFly --pf-t--global--color--warning--default
      '#c9190b', // PatternFly --pf-t--global--color--danger--default
      '#8a2be2', // PatternFly --pf-t--global--color--purple--default
      '#009596', // PatternFly --pf-t--global--color--cyan--default
      '#ec7a08', // PatternFly --pf-t--global--color--orange--default
    ],
    // Tooltip styling matching PatternFly design
    tooltip: {
      backgroundColor: 'rgba(21, 21, 21, 0.9)', // PatternFly --pf-t--global--background--color--600
      borderColor: '#0066cc', // PatternFly --pf-t--global--color--brand--default
      borderWidth: 1,
      textStyle: {
        color: '#ffffff', // PatternFly --pf-t--global--text--color--on-dark
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
  // Custom threshold colors for status indicators matching PatternFly tokens
  thresholds: {
    defaultColor: '#3e8635', // PatternFly --pf-t--global--color--success--default
    palette: [
      '#f0ab00', // PatternFly --pf-t--global--color--warning--default
      '#ec7a08', // PatternFly --pf-t--global--color--orange--default
      '#c9190b', // PatternFly --pf-t--global--color--danger--default
    ],
  },
  // Sparkline customization matching PatternFly tokens
  sparkline: {
    width: 3,
    color: '#0066cc', // PatternFly --pf-t--global--color--brand--default
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
