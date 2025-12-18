// API key for OMDb API
const apiKey = '3cf1daf6'; // Replace with your key

// Getting references to DOM elements for interaction
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieList = document.getElementById('movieList');
const movieDetails = document.getElementById('movieDetails');
const spinner = document.getElementById('spinner');

// Event listener for search button click to trigger movie search
searchBtn.addEventListener('click', () => searchMovies());

// Event listener for 'Enter' keypress on input field to trigger movie search
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchMovies();
});

// Function to show the loading spinner during API requests
function showSpinner() {
    spinner.classList.remove('hidden');
}

// Function to hide the loading spinner after API requests complete
function hideSpinner() {
    spinner.classList.add('hidden');
}

// Function to search for movies based on user input
function searchMovies() {
    const query = searchInput.value.trim(); // Get and trim search input
    movieDetails.classList.add('hidden'); // Hide movie details section on new search

    if (!query) {
        // Show alert if input is empty
        alert('Please enter a movie name to search!');
        return;
    }

    movieList.innerHTML = ''; // Clear previous movie list
    showSpinner(); // Show spinner while fetching data

    // Fetch movies matching the query from OMDb
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            hideSpinner(); // Hide spinner after response
            if (data.Response === 'True') {
                // For each movie in results, create a clickable card and append to movieList
                data.Search.forEach(movie => {
                    const card = document.createElement('div');
                    card.classList.add('movie-card');
                    card.innerHTML = `
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}" />
                <div class="movie-title">${movie.Title}</div>
                <div class="movie-year">${movie.Year}</div>
                `;
                    card.onclick = () => showMovieDetails(movie.imdbID); // Show details on click
                    movieList.appendChild(card);
                });
            } else {
                // Display error message if no movies found
                movieList.innerHTML = `<p>${data.Error}</p>`;
            }
        })
        .catch(() => {
            // Handle fetch errors gracefully
            hideSpinner();
            movieList.innerHTML = '<p>Sorry, something went wrong. Please try again later.</p>';
        });
}

// Function to fetch and display detailed info about a selected movie by IMDb ID
function showMovieDetails(imdbID) {
    movieDetails.innerHTML = ''; // Clear existing details
    movieDetails.classList.remove('hidden'); // Show movie details section
    showSpinner(); // Show spinner while fetching details

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`)
        .then(res => res.json())
        .then(movie => {
            hideSpinner(); // Hide spinner after response
            if (movie.Response === 'True') {
                // Populate movieDetails div with full movie info and close button
                movieDetails.innerHTML = `
          <button class="close-btn" onclick="movieDetails.classList.add('hidden')">X</button>
          <div class="clearfix">
            <img src="${movie.Poster != 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
            <h2>${movie.Title} (${movie.Year})</h2>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
          </div>`;
            } else {
                // Show error message if details not found
                movieDetails.innerHTML = `<p>${movie.Error}</p>`;
            }
        })
        .catch(() => {
            // Handle fetch errors gracefully during details fetch
            hideSpinner();
            movieDetails.innerHTML = '<p>Error loading movie details. Please try again.</p>';
            
        });
}


