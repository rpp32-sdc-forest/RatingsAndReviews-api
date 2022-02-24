import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 1000,
  duration: '1m',
};

export default function () {
  const id = Math.floor(Math.random()*1000000)
  const url = 'http://localhost:5000/ratings'
  const headers = {'Content-Type': 'application/json'}
  const data = {
    product_id: 62620,
    rating: 5,
    summary: 'excellent',
    body: 'jfkdla;fjkdal;jfkdla;jfkdla;jfkdal;fjkdla;jfkdal;jfkdla',
    recommend: true,
    name: 'joe2',
    email: 'joe2@prac.com',
    photos: [
      'https://res.cloudinary.com/dqidinkkf/image/upload/v1645728582/fyvkhadxbmpswarmje9d.png'
    ],
    characteristics: { '63': 5, '64': 5, '65': 5, '66': 5 }
  }

  http.post(url, JSON.stringify(data), {headers: headers})
  sleep(1);
}

