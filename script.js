// КиноДневник — JavaScript для интерактива итогового проекта

const movies = [
  {
    "title": "Амели",
    "genre": "Комедия",
    "year": 2001,
    "rating": "8.0",
    "description": "Нежная история о маленьких добрых поступках и необычном взгляде на мир."
  },
  {
    "title": "Большая рыба",
    "genre": "Драма",
    "year": 2003,
    "rating": "8.0",
    "description": "Сказочная драма о семье, памяти и историях, которые мы рассказываем."
  },
  {
    "title": "Вечное сияние чистого разума",
    "genre": "Драма",
    "year": 2004,
    "rating": "8.3",
    "description": "Фильм о любви, памяти и невозможности стереть важное полностью."
  },
  {
    "title": "Терминал",
    "genre": "Комедия",
    "year": 2004,
    "rating": "7.4",
    "description": "Тёплая история человека, который застрял в аэропорту и не потерял достоинство."
  },
  {
    "title": "Время",
    "genre": "Фантастика",
    "year": 2011,
    "rating": "6.7",
    "description": "Фантастический фильм о мире, где время стало главной валютой."
  },
  {
    "title": "Душа",
    "genre": "Анимация",
    "year": 2020,
    "rating": "8.0",
    "description": "История о смысле жизни, музыке и внимании к простым моментам."
  },
  {
    "title": "Шоу Трумана",
    "genre": "Драма",
    "year": 1998,
    "rating": "8.2",
    "description": "Фильм о реальности, свободе и жизни под постоянным наблюдением."
  },
  {
    "title": "Пассажиры",
    "genre": "Фантастика",
    "year": 2016,
    "rating": "7.0",
    "description": "Космическая драма о выборе, одиночестве и ответственности."
  },
  {
    "title": "Монстры на каникулах",
    "genre": "Анимация",
    "year": 2012,
    "rating": "7.0",
    "description": "Лёгкая анимационная комедия о семье, страхах и принятии нового."
  }
];

const cardsGrid = document.querySelector("#cardsGrid");
const showMoreBtn = document.querySelector("#showMoreBtn");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeBtn = document.querySelector("#themeBtn");
const feedbackForm = document.querySelector("#feedbackForm");

let visibleCount = 6;
let currentFilter = "all";

function getMoviesForRender() {
  if (currentFilter === "all") {
    return movies;
  }

  return movies.filter((movie) => movie.genre === currentFilter);
}

function makePosterGradient(index) {
  const gradients = [
    "linear-gradient(135deg, #111827, var(--primary))",
    "linear-gradient(135deg, var(--primary), var(--secondary))",
    "linear-gradient(135deg, #0f172a, var(--secondary))",
    "linear-gradient(135deg, #312e81, #111827)",
    "linear-gradient(135deg, #7f1d1d, #111827)"
  ];

  return gradients[index % gradients.length];
}

function renderMovies() {
  const filteredMovies = getMoviesForRender();
  const visibleMovies = filteredMovies.slice(0, visibleCount);

  cardsGrid.innerHTML = "";

  visibleMovies.forEach((movie, index) => {
    const card = document.createElement("article");
    card.className = "movie-card";

    card.innerHTML = `
      <div class="poster" style="background: linear-gradient(150deg, rgba(0,0,0,.06), rgba(0,0,0,.72)), ${makePosterGradient(index)}">
        <span>${movie.title}</span>
      </div>
      <div class="movie-body">
        <div class="movie-meta">
          <span class="badge">${movie.genre}</span>
          <span class="badge">${movie.year}</span>
        </div>
        <h3>${movie.title}</h3>
        <p class="movie-description">${movie.description}</p>
        <div class="movie-footer">
          <span class="rating">★ ${movie.rating}</span>
          <button class="add-btn" type="button">В список</button>
        </div>
      </div>
    `;

    const addButton = card.querySelector(".add-btn");
    addButton.addEventListener("click", () => {
      alert(`Фильм «${movie.title}» добавлен в список просмотра.`);
    });

    cardsGrid.append(card);
  });

  showMoreBtn.style.display = visibleCount >= filteredMovies.length ? "none" : "inline-flex";

  if (filteredMovies.length === 0) {
    cardsGrid.innerHTML = "<p>По выбранному жанру пока нет фильмов.</p>";
  }
}

showMoreBtn.addEventListener("click", () => {
  visibleCount += 3;
  renderMovies();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    currentFilter = button.dataset.filter;
    visibleCount = 6;
    renderMovies();
  });
});

function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeBtn.textContent = theme === "dark" ? "☀️ Тема" : "🌙 Тема";
}

const savedTheme = localStorage.getItem("10_movie_diary_theme") || "light";
setTheme(savedTheme);

themeBtn.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("10_movie_diary_theme", nextTheme);
  setTheme(nextTheme);
});

function setError(id, message) {
  document.querySelector(id).textContent = message;
}

function clearFormMessages() {
  setError("#nameError", "");
  setError("#emailError", "");
  setError("#messageError", "");
  document.querySelector("#successMessage").textContent = "";
}

function checkEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFormMessages();

  const formData = new FormData(feedbackForm);
  const data = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    message: formData.get("message").trim()
  };

  let isValid = true;

  if (data.name.length < 2) {
    setError("#nameError", "Введите имя минимум из 2 символов.");
    isValid = false;
  }

  if (!checkEmail(data.email)) {
    setError("#emailError", "Введите корректный email.");
    isValid = false;
  }

  if (data.message.length < 10) {
    setError("#messageError", "Сообщение должно быть не короче 10 символов.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  console.log("Данные формы:", data);
  document.querySelector("#successMessage").textContent = "Спасибо! Данные проверены и выведены в console.log.";
  feedbackForm.reset();
});

renderMovies();
