"use strict";

// app.use(findSearchSortPage):

module.exports = (req, res, next) => {
  // Searching & Pagination:

  // PAGINATION: URL?page=1&limit=10
  // LIMIT:
  const limit = 5;
  // PAGE:

  const page = req.query?.page ? Number(req.query?.page) - 1 : 0;
  // SKIP:
  const skip = page * limit;

  
  // SEARCINGH:
  const { bookName, authorName, publisher, publicationYear, city, district } = req.query;

  let searchQuery = {};

  // Add bookName filter if provided
  if (bookName) {
    searchQuery.name = { $regex: bookName, $options: 'i' }; // Partial match, case-insensitive
  }

  // Add authorName filter if provided
  if (authorName) {
    searchQuery.author = { $regex: authorName, $options: 'i' }; // Partial match, case-insensitive
  }

  // Add publisher filter if provided
  if (publisher) {
    searchQuery.bookStore = { $regex: publisher, $options: 'i' }; // Partial match, case-insensitive
  }

  // Add publicationYear filter if provided
  if (publicationYear) {
    searchQuery.publishmentYear = publicationYear; // Exact match for publicationYear
  }

  // Run SearchingSortingPagination engine for Model:
  res.getModelList = async function (Model, filters = {}, populate = null) {
    const filtersAndSearch = { ...filters, ...searchQuery };
    let data = await Model.find(filtersAndSearch).sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(populate);
      if(city){
        data = data?.filter((book)=>book?.user_id?.city?.value == city)
      }
      if(district){
        data = data?.filter((book)=>book?.user_id?.district?.value == district)
      }
    const dataCount = await Model.count(filtersAndSearch);
    return { data, dataCount };
  };

  next();
};
