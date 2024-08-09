
const movies = [
    {
        name: "The Shawshank Redemption",
        releaseYear: 1994,
        rating: 5,
        posterUrl: "https://m.media-amazon.com/images/I/81O3fE93rlL.jpg"
    },
    {
        name: "The Godfather",
        releaseYear: 1972,
        rating: 5,
        posterUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg"
    },
    {
        name: "The Dark Knight",
        releaseYear: 2008,
        rating: 5,
        posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdCP_JAnzpH6aIubXTkKK8lCbbNZQrE416bA&s"
    },
    {
        name: "Pulp Fiction",
        releaseYear: 1994,
        rating: 5,
        posterUrl: "https://images.bauerhosting.com/legacy/empire-tmdb/films/680/images/mte63qJaVnoxkkXbHkdFujBnBgd.jpg?ar=16%3A9&fit=crop&crop=top&auto=format&w=undefined&q=80"
    },
    {
        name: "The Lord of the Rings: The Return of the King",
        releaseYear: 2003,
        rating: 5,
        posterUrl: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg"
    },
    {
        name: "Inception",
        releaseYear: 2010,
        rating: 5,
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg"
    },
    {
        name: "Interstellar",
        releaseYear: 2014,
        rating: 5,
        posterUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
    },
    {
        name: "Fight Club",
        releaseYear: 1999,
        rating: 5,
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg"
    },
    {
        name: "Forrest Gump",
        releaseYear: 1994,
        rating: 5,
        posterUrl: "https://example.com/forrestgump.jpg"
    },
    {
        name: "The Matrix",
        releaseYear: 1999,
        rating: 5,
        posterUrl: "https://example.com/matrix.jpg"
    },
    {
        name: "The Departed",
        releaseYear: 2006,
        rating: 5,
        posterUrl: "https://example.com/departed.jpg"
    },
    {
        name: "Gladiator",
        releaseYear: 2000,
        rating: 5,
        posterUrl: "https://example.com/gladiator.jpg"
    },
    {
        name: "Se7en",
        releaseYear: 1995,
        rating: 5,
        posterUrl: "https://example.com/seven.jpg"
    },
    {
        name: "The Silence of the Lambs",
        releaseYear: 1991,
        rating: 5,
        posterUrl: "https://example.com/silenceofthelambs.jpg"
    },
    {
        name: "The Usual Suspects",
        releaseYear: 1995,
        rating: 5,
        posterUrl: "https://example.com/usualsuspects.jpg"
    }
];
   


const itemsPerPage = 8;
let currentPage = 1;
let searchQuery = '';

function displayMovies(page, search = '') {
    const filteredMovies = movies.filter(movie => 
        movie.name.toLowerCase().includes(search.toLowerCase())
    );
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedMovies = filteredMovies.slice(start, end);

    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = paginatedMovies.map(movie => `
        <div class="col-md-3">
            <div class="card mb-4">
                <img src="${movie.posterUrl}" class="card-img-top" alt="${movie.name}" style="height: 300px;">
                <div class="card-body">
                    <h5 class="card-title">${movie.name}</h5>
                    <p class="card-text">Release Year: ${movie.releaseYear}</p>
                    <p class="card-text">Rating: ${'★'.repeat(movie.rating)}${'☆'.repeat(5 - movie.rating)}</p>
                </div>
            </div>
        </div>
    `).join('');

    const pagination = document.querySelector('.pagination');
    const pageCount = Math.ceil(filteredMovies.length / itemsPerPage);
    pagination.innerHTML = Array.from({ length: pageCount }, (_, i) => `
        <li class="page-item ${i + 1 === page ? 'active' : ''}">
            <a class="page-link" href="#">${i + 1}</a>
        </li>
    `).join('');
}

function setupPagination() {
    document.querySelector('.pagination').addEventListener('click', e => {
        if (e.target.tagName === 'A') {
            currentPage = +e.target.textContent;
            displayMovies(currentPage, searchQuery);
        }
    });
}

function setupSearch() {
    document.getElementById('search-input').addEventListener('input', function() {
        searchQuery = this.value;
        currentPage = 1; 
        displayMovies(currentPage, searchQuery);
    });
}

function validateMovie(name, year) {
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        alert('Release year should be between 1900 and the current year.');
        return false;
    }
    if (movies.some(movie => movie.name.toLowerCase() === name.toLowerCase())) {
        alert('Movie with this name already exists.');
        return false;
    }
    return true;
}

document.getElementById('movie-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('movie-name').value;
    const releaseYear = +document.getElementById('release-year').value;
    const rating = +document.getElementById('rating').value;
    const posterUrl = document.getElementById('poster-url').value;

    if (validateMovie(name, releaseYear)) {
        movies.push({ name, releaseYear, rating, posterUrl });
        displayMovies(currentPage, searchQuery);
        alert('Movie added successfully!');
    }
});

function displaySettingsMovies() {
    const movieListSettings = document.getElementById('movie-list-settings');
    movieListSettings.innerHTML = movies.map((movie, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${movie.name} (${movie.releaseYear}) ${'★'.repeat(movie.rating)}${'☆'.repeat(5 - movie.rating)}
            <div>
                <button class="btn btn-sm btn-warning me-2" onclick="editMovie(${index})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteMovie(${index})">Delete</button>
            </div>
        </li>
    `).join('');
}

function deleteMovie(index) {
    if (confirm('Are you sure you want to delete this movie?')) {
        movies.splice(index, 1);
        displaySettingsMovies();
        displayMovies(currentPage, searchQuery); 
    }
}

function editMovie(index) {
    const movie = movies[index];
    document.getElementById('movie-name').value = movie.name;
    document.getElementById('release-year').value = movie.releaseYear;
    document.getElementById('rating').value = movie.rating;
    document.getElementById('poster-url').value = movie.posterUrl;

    const addMovieModal = new bootstrap.Modal(document.getElementById('addMovieModal'));
    addMovieModal.show();

    document.getElementById('movie-form').onsubmit = function (e) {
        e.preventDefault();
        if (validateMovie(movie.name, +document.getElementById('release-year').value)) {
            movie.name = document.getElementById('movie-name').value;
            movie.releaseYear = +document.getElementById('release-year').value;
            movie.rating = +document.getElementById('rating').value;
            movie.posterUrl = document.getElementById('poster-url').value;

            displaySettingsMovies();
            displayMovies(currentPage, searchQuery);
            addMovieModal.hide();
        }
    };
}

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('movie-list')) {
        displayMovies(currentPage, searchQuery);
        setupPagination();
        setupSearch();
    }
    if (document.getElementById('movie-list-settings')) {
        displaySettingsMovies();
    }
});

