import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 1000,
  duration: '1m',
};

export default function () {
  const id = Math.floor(Math.random()*1000000)
  http.put(`http://localhost:5000/report/${id}`)
  //sleep = how long waiting between each simulated user
  sleep(1);
}