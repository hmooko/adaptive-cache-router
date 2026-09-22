import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    primary_only: {
      executor: 'constant-arrival-rate',
      rate: Number(__ENV.RATE || 100),
      timeUnit: '1s',
      duration: __ENV.DURATION || '60s',
      preAllocatedVUs: Number(__ENV.PRE_ALLOCATED_VUS || 50),
      maxVUs: Number(__ENV.MAX_VUS || 500),
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

const baseUrl = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  const productId = Math.floor(Math.random() * 10000) + 1;
  const response = http.get(`${baseUrl}/products/${productId}`);

  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}
