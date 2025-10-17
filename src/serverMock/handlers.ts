import { http, HttpResponse } from 'msw';
import pieChartResponse from './responses/pieChartResponse.json';

export const handlers = [
  http.post('prometheus/api/v1/query_range', () => {
    return HttpResponse.json(pieChartResponse);
  }),
];
