const { data: sampleListings } = require('../../init/data');

function searchListings(query) {
    const lowerCaseQuery = query.toLowerCase();
    return sampleListings.filter(listing => {
        return (
            listing.title.toLowerCase().includes(lowerCaseQuery) ||
            listing.description.toLowerCase().includes(lowerCaseQuery) ||
            listing.location.toLowerCase().includes(lowerCaseQuery) ||
            listing.country.toLowerCase().includes(lowerCaseQuery)
        );
    });
}

module.exports = { searchListings };
