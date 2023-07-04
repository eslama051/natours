class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    this.meta = null;
  }
  filter() {
    let qureyObj = { ...this.queryStr };
    let exculdeFileds = ["page", "sort", "limit", "fields"];
    exculdeFileds.forEach((el) => delete qureyObj[el]);
    qureyObj = JSON.stringify(qureyObj);
    qureyObj = JSON.parse(
      qureyObj.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    );
    this.query = this.query.find(qureyObj);
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      console.log(this.query);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryStr.fields) {
      const selectBy = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(selectBy);
    } else {
      this.query.select("-__v");
    }
    return this;
  }

  async paginate(model, contorllerLimit) {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || contorllerLimit || 15;
    const skip = (page - 1) * limit;
    let last_page = 1;
    const qc = this.query.toConstructor();
    const cq = new qc();
    const numTours = await cq.countDocuments();
    console.log(numTours);
    if (this.queryStr.page) {
      last_page = Math.ceil(numTours / limit);
      if (skip >= numTours)
        throw new Error("the page you requested dont not exsit");
    }
    this.query = this.query.skip(skip).limit(limit);
    this.meta = {
      current_page: page,
      last_page: last_page,
      total: numTours,
      items_per_page: limit,
    };
    return this;
  }
}
module.exports = APIFeatures;
