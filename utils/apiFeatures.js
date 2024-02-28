class APIFeatures {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }
  field() {
    if (this.queryStr.field) {
      const field = this.queryStr.field
      this.query = this.query.select(field)
    } else {
      this.query = this.query.select('__v')
    }
    return this
  }
  paginate() {
    if (this.queryStr.page && this.queryStr.limit) {
      this.query = this.query
        .skip((this.queryStr.page - 1) * this.queryStr.limit)
        .limit(this.queryStr.limit)
    }
    return this
  }
  aggregate() {
    this.query = this.query.aggregate([
      {
        $matches: { price: 30 },
      },
    ])
  }
}

module.exports = APIFeatures
