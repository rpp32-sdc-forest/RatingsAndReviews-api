module.exports = {
  shapeReviews: (productId, data) => {
    var reviewIds = []
      var response = {
        product: productId,
        page: 0,
        count: null,
        results: []
      }
      // console.log('response', response)
      data.forEach(el => {

      if (!reviewIds.includes(el.rev_id)) {
        reviewIds.push(el.rev_id)

        var review = {}
        review.review_id = el.rev_id;
        review.rating = el.product_id;
        //check first for date
        if(el.date === null) {
          review.date = new Date().toString();
        } else {
          review.date = el.date
        }
        review.summary = el.summary;
        review.recommend = el.recommend;
        review.response = el.response;
        review.report = el.reported;
        review.body = el.body;
        review.date = el.date;
        review.reviewer_name = el.reviewer_name;
        review.review_email = el.reviewer_email;
        review.helpfulness = el.helpfulness;
          //if it's null just leave mepty array
          //if not null, push to array
        review.photos = []
        if (el.url !== null) {
          review.photos.push(el.url)
        }
        response.results.push(review)
      } else {
        for (var revs in response.results) {
          if (el.rev_id === revs.review_id) {
            if (el.url !== null) {
              revs.photos.push(el.url)
            }
          }
        }
      }
    })
    response.count = reviewIds.length;
    return response

  },

  shapeCharacteristics: (query1, query2, productId) => {

    var response = {
      product_id: productId,
      ratings: {},
      recommended: {},
      characteristics: {}
    }
    query1.forEach((char) => {
      var parsedCharName = JSON.parse(char.name)

      response.characteristics[parsedCharName] = {'id': char.char_id, 'value': char.value}
    })
    query2.forEach((rev) => {
      response.ratings[rev.rating] = rev.total
    })
    response.recommended = {
      '0': query2[0] ? query2[0].t : 0,
      '1': query2[0] ? query2[0].f : 0
    }
    return response
  }

}