class SearchFeatures {
     constructor(query, queryString) {
          this.query = query;
          this.queryString = queryString;
     };

     search() {

          const keyword = this.queryString.keyword 
               ? { name: { $regax: this.queryString.keyword, $options: "i" } } 
               : {};

          this.query = this.query.find({ ...keyword });
          return this;

     };

     filter() {

          const queryObj = { ...this.queryString };
          const removeFields = ["keyword", "page", "limit"];

          removeFields.forEach(id => delete queryObj[id]);

          let queryStr = JSON.stringify(queryObj);
          queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g), match => `$${match}`;

          this.query = this.query.find(JSON.parse(queryObj));
          return this;

     };

     pagination(resultPerPage) {

          const page = Number(this.query.page) || 1;
          const skip = resultPerPage * (page - 1);

          this.query = this.query.limit(resultPerPage).skip(skip);
          return this;

     };
};

module.exports = SearchFeatures;