
    const sampleListings = [
      // Your listings array here...
      {
        title: "Cozy Beachfront Cottage",
        description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
        image: {
          filename: "listingimage",
          url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        },
        price: 1500,
        location: "Malibu",
        country: "United States",
      },
      {
        title: "Modern Loft in Downtown",
        description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
        image: {
          filename: "listingimage",
          url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        },
        price: 1200,
        location: "New York City",
        country: "United States",
      },
      // Add the rest of your listings here...
    ];

    function displayListings(listings) {
      const container = document.getElementById('listingsContainer');
      container.innerHTML = ''; // Clear previous listings

      listings.forEach(listing => {
        const listingElement = document.createElement('div');
        listingElement.classList.add('listing');
        
        listingElement.innerHTML = `
          <h2>${listing.title}</h2>
          <p>${listing.description}</p>
          <img src="${listing.image.url}" alt="${listing.image.filename}">
          <p><strong>Price:</strong> $${listing.price}</p>
          <p><strong>Location:</strong> ${listing.location}, ${listing.country}</p>
        `;
        
        container.appendChild(listingElement);
      });
    }

    function filterListings() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const filteredListings = sampleListings.filter(listing => 
        listing.title.toLowerCase().includes(query) || listing.location.toLowerCase().includes(query)
      );
      displayListings(filteredListings);
    }

    // Initial display of all listings
    displayListings(sampleListings);
  
