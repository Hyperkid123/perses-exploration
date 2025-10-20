import { http, HttpResponse } from 'msw';
import pieChartResponse from './responses/pieChartResponse.json';
import gaugeChartResponse from './responses/gaugeChartResponse.json';
import profileQueryResponse from './responses/profileQueryResponse.json';
import heatmapResponse from './responses/heatmapResponse.json';
import traceSearchResponse from './responses/traceSearchResponse.json';
import statChartResponse from './responses/statChartResponse.json';
import statusHistoryResponse from './responses/statusHistoryResponse.json';

export const handlers = [
  http.post('prometheus/api/v1/query_range', async ({ request }) => {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const query = params.get('query');
    if (query === 'sum(rate(container_cpu_usage_seconds_total{container!="", image!=""}[5m])) by (namespace)') {
      return HttpResponse.json(pieChartResponse);
    } else if (query === 'sum(rate(pyroscope_cpu_usage[5m])) by (app)') {
      return HttpResponse.json(profileQueryResponse);
    } else if (query === 'avg(rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100') {
      console.log('Returning gauge chart response');
      return HttpResponse.json(gaugeChartResponse);
    } else if (query === 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))') {
      console.log('Returning heatmap histogram response');
      return HttpResponse.json(heatmapResponse);
    } else if (query === 'avg(cpu_usage_percent) by (service)') {
      console.log('Returning stat chart response');
      return HttpResponse.json(statChartResponse);
    } else if (query === 'up{job=~".*"}') {
      console.log('Returning status history response');
      return HttpResponse.json(statusHistoryResponse);
    }

    // fallback to time series query
    return HttpResponse.json(pieChartResponse);
  }),
  // Pyroscope plugin response for the flame chart
  http.get('*/prometheus/pyroscope/render', async () => {
    // Mock Pyroscope searchProfiles API
    const mockPyroscopeResponse = {
      flamebearer: {
        names: ['process_cpu:cpu:nanoseconds:cpu:nanoseconds', 'main', 'handler', 'worker'],
        levels: [
          [0, 1000, 100, 0],
          [0, 400, 50, 1, 400, 300, 30, 2],
          [0, 200, 25, 3, 200, 150, 15, 1, 400, 100, 10, 3],
        ],
        numTicks: 1000,
        maxSelf: 100,
      },
      metadata: {
        spyName: 'pyroscope',
        sampleRate: 100,
        units: 'nanoseconds',
        name: 'process_cpu:cpu:nanoseconds:cpu:nanoseconds',
      },
      timeline: {
        startTime: 1696118400,
        samples: [100, 200, 150, 180],
        durationDelta: 60,
      },
    };
    return HttpResponse.json(mockPyroscopeResponse);
  }),
  // Tempo trace search API endpoint
  http.get('*/api/search', async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');

    console.log('Tempo search request to /api/search:', {
      url: request.url,
      query,
      start,
      end,
      searchParams: url.searchParams.toString()
    });
    console.log('Returning trace data:', traceSearchResponse);
    return HttpResponse.json(traceSearchResponse);
  }),
];
