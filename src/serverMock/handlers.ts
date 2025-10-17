import { http, HttpResponse } from 'msw';
import pieChartResponse from './responses/pieChartResponse.json';
import profileQueryResponse from './responses/profileQueryResponse.json';

export const handlers = [
  http.post('prometheus/api/v1/query_range', async ({ request }) => {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const query = params.get('query');
    if (query === 'sum(rate(container_cpu_usage_seconds_total{container!="", image!=""}[5m])) by (namespace)') {
      return HttpResponse.json(pieChartResponse);
    } else if (query === 'sum(rate(pyroscope_cpu_usage[5m])) by (app)') {
      return HttpResponse.json(profileQueryResponse);
    }

    // fallback to time series query
    return HttpResponse.json(pieChartResponse);
  }),
  http.get('*/prometheus/pyroscope/render', async ({ request }) => {
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
];
