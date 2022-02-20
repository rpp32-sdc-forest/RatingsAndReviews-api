const request = require("supertest")
// const db = require('../index.js')
// const app = require('../server.js')

//set up test database -- clear database before each test

//supertest returns a promise -- need async function
const baseUrl = 'http://localhost:5000/'

// beforeEach((done) => {
//   db.connect('http://localhost:5000/ratings',
//   {useNewUrlParser: true, useUnifiedTopology: true},
//   () => done());
//   })

// afterEach((done) => {
//   db.connection.db.dropDatabase(() => {
//     db.connection.close(() => done())
//   })
// })

it('should run Jest', () => {
  expect(1).toBe(1)
})

// test("GET /ratings", async () => {
//   const post = await Post.create({
//     "product_id": 64620,
//     "rating": 5,
//     "summary": "dfaklf;a",
//     "body": "fdajkfl;dajfkl;sadjfkl;asjflsad;jflskad;jfklsad;jfaslk;j",
//     "recommend": true,
//     "name": "julie",
//     "email": "juli@prac.com",
//     "photos": [
//       "https://res.cloudinary.com/dqidinkkf/image/upload/v1645302397/ywi2zfzejw5p3xnghuyt.png"
//     ],
//     "characteristics": { "63": 5, "64": 5, "65": 5, "66": 5 }
//   })
//   await supertest(app).get('ratings/64620')
//   .expect(200)
//   .then((response) => {
//     expect(response.body.name).toBe('julie')
//     expect(Array.isArray(response.body.photos)).toBeTruthy()
//   })
// })

// describe('review', () => {

//   describe('get review route', () => {

//     describe('given the product_id does not exist in reviews', () => {

//       it('should return a 404', async() => {
//         const product_id = 0
//         await supertest(app).get(`/ratings/${product_id}`).expect(404)
//       })

//       it('should return a 200', async() => {
//         const product_id = 25
//         await supertest(app).get(`/ratings/${product_id}.expect(200)`)
//       })

//     })
//   })
// })


jest.setTimeout(10000)

describe('Ratings endpoint', () => {
  it('should return a 200 status code', async () => {
    const response = await request(baseUrl)
    .get('ratings/25');

    expect(response.statusCode).toBe(200);
  })
})

//does it match api data shape?