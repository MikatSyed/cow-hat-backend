"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryHelpers = void 0;
const calculateQuery = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'asc';
    const minPrice = options.minPrice;
    const maxPrice = options.maxPrice;
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
    };
};
exports.queryHelpers = {
    calculateQuery,
};
