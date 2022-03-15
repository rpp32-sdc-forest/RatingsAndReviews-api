import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 1000,
  duration: '1m',
};

export default function () {
  const max = 100000
  const min = 90000
  const id = Math.floor(Math.random()*(max - min + 1)) + min
  // http.get('https://test.k6.io');
  http.get(`http://localhost:5000/ratings/reviews/${id}`)
  //sleep = how long waiting between each simulated user
  sleep(1);
}

