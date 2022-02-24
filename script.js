import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 20,
  duration: '30s',
};

// import {getReviews, getCharacteristicReviews, postReview, updateHelpfulness} from 'dbMethods.js'

// module.exports = {
//   test: () => {
//     http.get('https://test.k6.io');
//     sleep(1);
//   },

//   getReviews: () => {
//     getReviews()
//   }

// }

export default function () {
  // http.get('https://test.k6.io');
  // http.get('http://localhost:5000/ratings/2500')
  // http.get('http://localhost:5000/characteristics/2500')
  // http.get('http://localhost:5000/helpful/2500')
  http.get('http://localhost:5000/report/2500')
  //sleep = how long waiting between each simulated user
  sleep(1);
}

