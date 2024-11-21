"use strict";

// app.use(findSearchSortPage):

module.exports = (req, res, next) => {
  // Searching & Pagination:

  // PAGINATION: URL?page=1&limit=10
  // LIMIT:
  const limit = 10;
  // PAGE:

  const page = req.query?.page ? Number(req.query?.page) - 1 : 0;
  // SKIP:
  const skip = page * limit;

  // Run SearchingSortingPagination engine for Model:
  res.getModelList = async function (Model, filters = {}, populate = null) {
    const filtersAndSearch = {...filters};
    const data = await Model.find(filtersAndSearch)
      .skip(skip)
      .limit(limit)
      .populate(populate);
    const dataCount = await Model.count(filtersAndSearch);
    return { data, dataCount };
  };

  next();
};
