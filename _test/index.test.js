

const convertChar = require('../index.js')

test('returns short csv transformed into an object', () => {
  expect(convertChar()).then(data => typeof data).resolves.toBe("object")
})

//does it match api data shape?