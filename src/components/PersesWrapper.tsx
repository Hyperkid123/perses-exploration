import { PropsWithChildren } from 'react';

import { ChartsProvider, SnackbarProvider } from '@perses-dev/components';
import { TimeRangeProvider } from '@perses-dev/plugin-system';
import { generateChartsTheme, getTheme } from '@perses-dev/components';
import { QueryClientProvider } from '@tanstack/react-query';
import * as prometheusPlugin from '@perses-dev/prometheus-plugin';

import { fakeDatasourceApi, queryClient } from '../perses/dataSourceApi';
import { DatasourceStoreProvider, VariableProvider } from '@perses-dev/dashboards';
import { useTheme } from '../hooks/useTheme';

const persesTimeRange = {
  pastDuration: '1h' as prometheusPlugin.DurationString,
};

// Custom charts theme with PatternFly-aligned colors
// Note: ECharts doesn't support CSS variables, so we use hex values that match PatternFly tokens
// Function to generate theme-aware charts theme
const generatePatternFlyChartsTheme = (theme: 'light' | 'dark') => {
  const muiTheme = getTheme(theme);

  // Define theme-specific colors
  const isDark = theme === 'dark';
  const tooltipBg = isDark ? 'rgba(21, 21, 21, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipText = isDark ? '#ffffff' : '#151515';
  const tooltipBorder = '#0066cc';
  const shadowColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)';

  return generateChartsTheme(muiTheme, {
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
      // Theme-aware tooltip styling
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        textStyle: {
          color: tooltipText,
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
            shadowColor: shadowColor,
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
};

const PersesWidgetWrapper = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const { theme } = useTheme();
  const chartsTheme = generatePatternFlyChartsTheme(theme);

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
