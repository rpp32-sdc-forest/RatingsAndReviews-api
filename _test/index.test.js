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

// {
//   product: '18',
//   page: 0,
//   count: 3,
//   results: [
//     {
//       review_id: 51,
//       rating: 18,
//       summary: '"Aut debitis voluptatem vel fuga similique velit."',
//       recommend: 'true',
//       response: undefined,
//       report: '1',
//       body: '"Sequi cum sapiente iusto. Illo mollitia pariatur nam non in expedita alias. Reprehenderit sit distinctio adipisci sunt. Explicabo officiis et. Velit corporis et natus voluptatem ducimus nihil quia officiis. Eligendi nobis eum iusto eveniet odio perspiciatis."',
//       date: '1617448837842',
//       reviewer_name: '"Carolanne.Rodriguez10"',
//       review_email: '"Hassie_Friesen@yahoo.com"',
//       helpfulness: 13,
//       photos: [Array]
//     }
//}

//
// {
  //   product_id: '25',
  //   ratings: { '1': 1, '2': 3, '3': 1, '4': 2, '5': 1 },
  //   recommended: { '0': 7, '1': 1 },
  //   characteristics: {
  //     Size: { id: 88, value: 2.75 },
  //     Width: { id: 89, value: 3 },
  //     Comfort: { id: 90, value: 2 },
  //     Quality: { id: 91, value: 3.125 }
  //   }
  // }



jest.setTimeout(10000)

describe('Ratings endpoint', () => {
  const expectedResponse = {}

  it('should return a 200 status code and an object with expected props', async () => {
    const response = await request(baseUrl)
    .get('ratings/25');
    // console.log('response', response.body)
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.results)).toBeTruthy()
    expect(typeof response.body).toBe('object')

    // expect.objectContaining({
    //   product: expect.any(Number),
    //   page: expect.any(Number),
    //   count: expect.any(Number),
    //   results: expect.(Array.isArray([results])).toBeTruthy()
    })
    //TRY TO GET THIS ONE TO WORK
  // it('should return a 500 if sent invalid product_id', async () => {
  //   const response = await request(baseUrl)
  //   .get('ratings/0')
  //   console.log('response error', response.body)
  //   expect(response.statusCode).toBe(500)
  // })
})

// describe('POST review endpoint', () => {

//   it('should return a 200 status code', async () => {
//     const response = await request(baseUrl)
//     .post('ratings');
//     expect(response.statusCode).toBe(200);
//   })
// })



describe('Characteristics endpoint', () => {

  it('should return a 200 status code', async () => {
    const response = await request(baseUrl)
    .get('characteristics/25');
    console.log('char response body', response.body)
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe('object')
  })
})

describe('Helpful endpoint', () => {

  it('should return a 200 status code', async () => {
    const response = await request(baseUrl)
    .put('helpful/25');
    expect(response.statusCode).toBe(200);
  })
})

describe('Report endpoint', () => {

  it('should return a 200 status code', async () => {
    const response = await request(baseUrl)
    .put('report/25');
    expect(response.statusCode).toBe(200);
  })
})



//does it match api data shape?