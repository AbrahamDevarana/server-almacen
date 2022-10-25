const getPagingData = ( data, page, limit ) => {
    const { count: totalItem , rows } = data
    const currentPage = page ? + page : 0
    const totalPages = Math.ceil(totalItem / limit)
    return { totalItem, rows, totalPages, currentPage }
}   

const getPagination = (page, size) => {
    const limit = size ? + size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};



module.exports = {
    getPagingData,
    getPagination
}