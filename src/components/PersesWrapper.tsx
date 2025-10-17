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

export const muiTheme = getTheme('light');
export const chartsTheme = generateChartsTheme(muiTheme, {});

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
