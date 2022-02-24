import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 2000,
  duration: '1m',
};

export default function () {
  var id = Math.floor(Math.random() * 1000)
  http.get(`http://127.0.0.1:5000/characteristics/${id}`)
  sleep(1);
}
