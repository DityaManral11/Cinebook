import { useEffect, useMemo, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clapperboard,
  Clock3,
  Film,
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  UserRound,
  X,
  Armchair,
  LogOut,
  Download,
} from "lucide-react";
import { api } from "./api";
import "./App.css";

const fallbackMovies = [
  {
    id: 1,
    title: "Beyond the Stars",
    genre: "Sci-Fi / Adventure",
    duration: 138,
    rating: 8.7,
    language: "English",
    certificate: "UA",
    description:
      "A crew of explorers discovers a signal beyond the edge of the known universe, changing everything they believe about humanity.",
    posterUrl:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=700",
    bannerUrl:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1800",
    releaseYear: 2026,
  },
  {
    id: 2,
    title: "Midnight Promise",
    genre: "Romance / Drama",
    duration: 124,
    rating: 8.1,
    language: "Hindi",
    certificate: "UA",
    description:
      "Two strangers cross paths in a city that never sleeps, and learn that the right moment can change a lifetime.",
    posterUrl:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=700",
    bannerUrl:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1800",
    releaseYear: 2026,
  },
  {
    id: 3,
    title: "The Last Clue",
    genre: "Mystery / Thriller",
    duration: 131,
    rating: 8.4,
    language: "Hindi",
    certificate: "UA",
    description:
      "A sharp young investigator has one night to solve a case where every witness is hiding something.",
    posterUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700",
    bannerUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1800",
    releaseYear: 2026,
  },
  {
    id: 4,
    title: "Pixel Planet",
    genre: "Animation / Family",
    duration: 106,
    rating: 7.9,
    language: "English",
    certificate: "U",
    description:
      "A curious inventor and a tiny robot set off on a colourful journey to save their home world.",
    posterUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=700",
    bannerUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1800",
    releaseYear: 2026,
  },
  {
    id: 5,
    title: "Redline",
    genre: "Action / Crime",
    duration: 129,
    rating: 8.2,
    language: "Hindi",
    certificate: "A",
    description:
      "A former racer is pulled into a high-stakes chase through a city full of secrets and shifting loyalties.",
    posterUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=700",
    bannerUrl:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1800",
    releaseYear: 2026,
  },
  {
    id: 6,
    title: "Ocean Between Us",
    genre: "Drama / Romance",
    duration: 118,
    rating: 7.8,
    language: "Hindi",
    certificate: "UA",
    description:
      "A heartfelt story about family, distance, and the choices that bring people home.",
    posterUrl:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=700",
    bannerUrl:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1800",
    releaseYear: 2026,
  },
];

const formatDuration = (minutes) => {
  if (!minutes) return "—";
  const hours = Math.floor(Number(minutes) / 60);
  const mins = Number(minutes) % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
};

const times = ["10:15 AM", "1:30 PM", "4:45 PM", "7:30 PM", "10:15 PM"];
const theatres = [
  "CineBook Luxe, Select Citywalk",
  "PVR Cinemas, Saket",
  "INOX, Nehru Place",
];

function Header({
  user,
  onLogout,
  cities = [],
  selectedCity = "Delhi",
  onCityChange = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Do you really want to log out of this account?",
    );

    if (confirmed) {
      onLogout();
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">
            <Ticket size={21} />
          </span>
          <span>
            Cine<span>Book</span>
          </span>
        </Link>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "main-nav open" : "main-nav"}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/movies" onClick={() => setMenuOpen(false)}>
            Movies
          </NavLink>
          <NavLink to="/experience" onClick={() => setMenuOpen(false)}>
            Experience
          </NavLink>
          <NavLink to="/my-bookings" onClick={() => setMenuOpen(false)}>
            My Bookings
          </NavLink>
          <NavLink
            to={user?.role === "admin" ? "/admin" : "/admin/login"}
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Admin Portal
          </NavLink>
        </nav>

        <div className="header-actions">
          <div className="city-selector">
            <MapPin size={17} className="city-icon" />

            <div className="city-selector-content">
              <span className="city-label">YOUR LOCATION</span>

              <select
                aria-label="Select city"
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                disabled={!cities.length}
                className="city-select"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <ChevronDown size={15} className="city-chevron" />
          </div>

          {user ? (
            <button className="user-chip" onClick={handleLogout}>
              <UserRound size={16} />
              {user.name.split(" ")[0]}
              <LogOut size={14} />
            </button>
          ) : (
            <Link className="btn btn-outline btn-small" to="/login">
              <UserRound size={16} /> Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function MovieCard({ movie, index = 0 }) {
  return (
    <article className="movie-card" style={{ "--delay": `${index * 60}ms` }}>
      <Link to={`/movies/${movie.id}`} className="poster-wrap">
        <img
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=700";
          }}
        />
        <span className="poster-rating">
          <Star size={13} fill="currentColor" />{" "}
          {Number(movie.rating).toFixed(1)}
        </span>
        <span className="poster-overlay">
          <span className="round-play">▶</span>
          <span>View details</span>
        </span>
      </Link>

      <div className="movie-card-info">
        <div className="movie-title-row">
          <Link to={`/movies/${movie.id}`} className="movie-title">
            {movie.title}
          </Link>
          <span className="certificate">{movie.certificate || "UA"}</span>
        </div>
        <p>
          {movie.genre} <span>·</span> {formatDuration(movie.duration)}
        </p>
        <div className="movie-card-bottom">
          <span className="language">{movie.language}</span>
          <Link className="book-link" to={`/movies/${movie.id}`}>
            Book <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Home({ movies, loading, error }) {
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const featured = movies[0] || fallbackMovies[0];
  const genres = [
    "All",
    "Action",
    "Drama",
    "Romance",
    "Sci-Fi",
    "Mystery",
    "Animation",
  ];

  const filtered = useMemo(
    () =>
      movies.filter((m) => {
        const matchesQuery = `${m.title} ${m.genre} ${m.language}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesGenre =
          activeGenre === "All" ||
          m.genre.toLowerCase().includes(activeGenre.toLowerCase());
        return matchesQuery && matchesGenre;
      }),
    [movies, query, activeGenre],
  );

  return (
    <main>
      <section
        className="hero"
        style={{ "--hero-image": `url("${featured.bannerUrl}")` }}
      >
        <div className="hero-shade"></div>
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot"></span> THE CINEMA EXPERIENCE, REIMAGINED
          </div>
          <div className="hero-kicker">
            <Sparkles size={15} /> FEATURED THIS WEEK
          </div>
          <h1>
            Stories that stay
            <br />
            <span>with you.</span>
          </h1>
          <p className="hero-copy">
            Big screen moments. Unforgettable stories.
            <br className="desktop-break" /> Your next favourite movie starts
            here.
          </p>
          <div className="hero-feature">
            <span>
              <Star size={15} fill="currentColor" />{" "}
              {Number(featured.rating).toFixed(1)} / 10
            </span>
            <i></i>
            <span>{featured.genre}</span>
            <i></i>
            <span>
              <Clock3 size={15} /> {formatDuration(featured.duration)}
            </span>
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={`/movies/${featured.id}`}>
              <Ticket size={18} /> Book tickets <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-glass" to="/movies">
              <Clapperboard size={17} /> Explore movies
            </Link>
          </div>
        </div>
        <div className="hero-bottom-note">
          <span className="hero-line"></span> YOUR SEAT. YOUR STORY. YOUR
          CINEBOOK.
        </div>
        <div className="hero-index">
          <span>01</span> / 06
        </div>
      </section>

      <section className="content-section" id="movies">
        <div className="section-heading">
          <div>
            <div className="section-kicker">NOW SHOWING</div>
            <h2>
              Find your next <span>favourite.</span>
            </h2>
            <p>Handpicked stories, ready for the big screen.</p>
          </div>
          <Link className="text-link" to="/movies">
            View all movies <ArrowRight size={17} />
          </Link>
        </div>

        <div className="movie-tools">
          <div className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, genres..."
              aria-label="Search movies"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>
          <div className="genre-tabs">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={activeGenre === g ? "genre-tab active" : "genre-tab"}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="notice notice-warn">
            {error} Showing sample movies until the API is available.
          </div>
        )}
        {loading ? (
          <div className="loading-state">Getting the popcorn ready…</div>
        ) : filtered.length ? (
          <div className="movie-grid">
            {filtered.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Film size={32} />
            <h3>No movies found</h3>
            <p>Try another title or genre.</p>
            <button
              className="btn btn-outline"
              onClick={() => {
                setQuery("");
                setActiveGenre("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="experience-section" id="experience">
        <div className="experience-copy">
          <div className="section-kicker">MORE THAN A MOVIE</div>
          <h2>
            Make it a night
            <br />
            to <span>remember.</span>
          </h2>
          <p>
            From the first trailer to the final credits, your perfect cinema
            plan is only a few clicks away.
          </p>
          <Link to="/movies" className="btn btn-primary">
            Plan your movie night <ArrowRight size={17} />
          </Link>
        </div>

        <div className="experience-points">
          <div>
            <span className="feature-icon">
              <Armchair />
            </span>
            <div>
              <h3>Your perfect seat</h3>
              <p>Choose the seats you love, together.</p>
            </div>
          </div>
          <div>
            <span className="feature-icon">
              <ShieldCheck />
            </span>
            <div>
              <h3>Simple, secure booking</h3>
              <p>Your booking details, all in one place.</p>
            </div>
          </div>
          <div>
            <span className="feature-icon">
              <CalendarDays />
            </span>
            <div>
              <h3>Plans made easy</h3>
              <p>Find a showtime that works for you.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function MoviesPage({ movies }) {
  const [search, setSearch] = useState("");
  const list = movies.filter((m) =>
    `${m.title} ${m.genre}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="inner-page movies-page">
      <div className="page-heading">
        <div className="section-kicker">THE MOVIE COLLECTION</div>
        <h1>
          All the stories.
          <br />
          <span>One destination.</span>
        </h1>
        <p>Pick your mood. We’ll find the movie.</p>
      </div>
      <div className="search-box page-search">
        <Search size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or genre..."
        />
      </div>
      <div className="movie-grid">
        {list.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} index={i} />
        ))}
      </div>
      {!list.length && (
        <div className="empty-state">
          <Film size={32} />
          <h3>No matches yet</h3>
          <p>Try searching for a different movie.</p>
        </div>
      )}
      <Footer />
    </main>
  );
}

function MovieDetails({ movies, user, selectedCity }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => String(m.id) === id);

  const [date, setDate] = useState("");
  const [shows, setShows] = useState([]);
  const [showsLoading, setShowsLoading] = useState(false);
  const [showsError, setShowsError] = useState("");
  const [theatreId, setTheatreId] = useState("");
  const [selectedShowId, setSelectedShowId] = useState("");
  const [cityTheatreIds, setCityTheatreIds] = useState([]);
  const [theatresLoading, setTheatresLoading] = useState(true);
  const [theatresError, setTheatresError] = useState("");

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  const maxDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  // Load all scheduled shows for this movie
  useEffect(() => {
    let active = true;

    setShows([]);
    setDate("");
    setTheatreId("");
    setSelectedShowId("");
    setShowsLoading(true);
    setShowsError("");

    api(`/shows?movieId=${id}`)
      .then((data) => {
        if (!active) return;

        const list = Array.isArray(data) ? data : [];
        setShows(list);

        const dates = [
          ...new Set(
            list
              .filter((show) => {
                const showDate = String(show.startsAt).slice(0, 10);
                return (
                  showDate >= today &&
                  showDate <= maxDate &&
                  new Date(show.startsAt) > new Date()
                );
              })
              .map((show) => String(show.startsAt).slice(0, 10)),
          ),
        ].sort();

        setDate(dates[0] || "");
      })
      .catch((e) => {
        if (active) setShowsError(e.message);
      })
      .finally(() => {
        if (active) setShowsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;

    setTheatresLoading(true);
    setTheatresError("");
    setCityTheatreIds([]);
    setTheatreId("");
    setSelectedShowId("");

    api(`/theatres?city=${encodeURIComponent(selectedCity)}`)
      .then((data) => {
        if (!active) return;

        const list = Array.isArray(data) ? data : [];
        setCityTheatreIds(list.map((theatre) => String(theatre.id)));
      })
      .catch((error) => {
        if (active) setTheatresError(error.message);
      })
      .finally(() => {
        if (active) setTheatresLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCity]);

  // Only show dates which have scheduled shows
  const availableDates = [
    ...new Set(
      shows
        .filter((show) => {
          const showDate = String(show.startsAt).slice(0, 10);
          return (
            cityTheatreIds.includes(String(show.theatreId)) &&
            showDate >= today &&
            showDate <= maxDate &&
            new Date(show.startsAt) > new Date()
          );
        })
        .map((show) => String(show.startsAt).slice(0, 10)),
    ),
  ].sort();

  useEffect(() => {
    if (showsLoading || theatresLoading) return;

    setDate((currentDate) =>
      availableDates.includes(currentDate)
        ? currentDate
        : availableDates[0] || "",
    );

    setTheatreId("");
    setSelectedShowId("");
  }, [shows, cityTheatreIds, showsLoading, theatresLoading]);

  // Shows for selected date
  const dateShows = shows.filter(
    (show) =>
      cityTheatreIds.includes(String(show.theatreId)) &&
      String(show.startsAt).slice(0, 10) === date &&
      new Date(show.startsAt) > new Date(),
  );

  const availableTheatres = [
    ...new Map(
      dateShows.map((show) => [
        show.theatreId,
        { id: show.theatreId, name: show.theatreName },
      ]),
    ).values(),
  ];

  const filteredShows = dateShows.filter(
    (show) => !theatreId || String(show.theatreId) === String(theatreId),
  );

  const selectedShow = shows.find(
    (show) => String(show.id) === String(selectedShowId),
  );

  const formatShowTime = (value) =>
    new Date(value).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });

  const formatDate = (value) => {
    const d = new Date(`${value}T00:00:00`);
    return {
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      number: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  };

  if (!movie) {
    return (
      <main className="inner-page">
        <div className="empty-state">
          <Film size={32} />
          <h3>Movie not found</h3>
          <Link to="/movies" className="btn btn-primary">
            Browse movies
          </Link>
        </div>
      </main>
    );
  }

  const bookingState = selectedShow
    ? {
        date,
        showId: selectedShow.id,
        time: formatShowTime(selectedShow.startsAt),
        theatre: selectedShow.theatreName,
        price: selectedShow.price,
      }
    : {};

  return (
    <main className="movie-detail-page">
      <div
        className="detail-backdrop"
        style={{ backgroundImage: `url("${movie.bannerUrl}")` }}
      ></div>

      <div className="detail-content">
        <Link className="back-link" to="/movies">
          ← Back to movies
        </Link>

        <div className="detail-layout">
          <img
            className="detail-poster"
            src={movie.posterUrl}
            alt={movie.title}
          />

          <div className="detail-info">
            <div className="section-kicker">
              NOW SHOWING · {movie.releaseYear || 2026}
            </div>

            <h1>{movie.title}</h1>

            <div className="detail-meta">
              <span className="rating">
                <Star size={16} fill="currentColor" />
                {Number(movie.rating).toFixed(1)}
              </span>
              <span>{movie.certificate || "UA"}</span>
              <span>{formatDuration(movie.duration)}</span>
              <span>{movie.language}</span>
            </div>

            <p className="detail-description">{movie.description}</p>

            <div className="detail-genres">
              {(movie.genre || "").split("/").map((g) => (
                <span key={g}>{g.trim()}</span>
              ))}
            </div>

            <div className="booking-panel">
              <div className="booking-panel-heading">
                <div>
                  <div className="section-kicker">BOOK YOUR SEATS</div>
                  <h2>Choose your show</h2>
                </div>

                <span className="price-tag">
                  {selectedShow ? `₹${selectedShow.price}` : "—"}
                  <small> / seat</small>
                </span>
              </div>

              <label className="field-label">Select date</label>

              {showsLoading || theatresLoading ? (
                <p>Finding available dates...</p>
              ) : showsError ? (
                <p className="notice notice-error">{showsError}</p>
              ) : availableDates.length ? (
                <div
                  className="time-options"
                  style={{ flexWrap: "wrap", gap: 10 }}
                >
                  {availableDates.map((showDate) => {
                    const d = formatDate(showDate);

                    return (
                      <button
                        key={showDate}
                        disabled={showsLoading || theatresLoading}
                        type="button"
                        className={
                          date === showDate
                            ? "time-option selected"
                            : "time-option"
                        }
                        onClick={() => {
                          setDate(showDate);
                          setTheatreId("");
                          setSelectedShowId("");
                        }}
                        style={{
                          minWidth: 75,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <small>{d.day}</small>
                        <strong>{d.number}</strong>
                        <small>{d.month}</small>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="notice notice-warn">
                  No upcoming shows are scheduled for this movie yet.
                </p>
              )}

              <label className="field-label">Select cinema</label>
              {theatresError && (
                <p className="notice notice-error">{theatresError}</p>
              )}

              <select
                className="field-input"
                value={theatreId}
                disabled={showsLoading || theatresLoading || !dateShows.length}
                onChange={(e) => {
                  setTheatreId(e.target.value);
                  setSelectedShowId("");
                }}
              >
                <option value="">All available cinemas</option>
                {availableTheatres.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <label className="field-label">Select showtime</label>

              {showsLoading || theatresLoading ? (
                <p>Loading showtimes...</p>
              ) : filteredShows.length ? (
                <div className="time-options">
                  {filteredShows.map((show) => (
                    <button
                      key={show.id}
                      type="button"
                      className={
                        String(selectedShowId) === String(show.id)
                          ? "time-option selected"
                          : "time-option"
                      }
                      onClick={() => setSelectedShowId(String(show.id))}
                    >
                      {formatShowTime(show.startsAt)}
                    </button>
                  ))}
                </div>
              ) : date ? (
                <p className="notice notice-warn">
                  No shows available for this selection.
                </p>
              ) : null}

              <button
                className="btn btn-primary btn-wide"
                disabled={!selectedShow || showsLoading}
                onClick={() =>
                  user
                    ? navigate(`/book/${movie.id}`, { state: bookingState })
                    : navigate("/login", {
                        state: { from: `/book/${movie.id}`, ...bookingState },
                      })
                }
              >
                Choose seats <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function BookingPage({ movies, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => String(m.id) === id);
  const saved = window.history.state?.usr || {};

  const [selected, setSelected] = useState([]);
  const [busySeats, setBusySeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState("");

  const showId = Number(saved.showId);

  useEffect(() => {
    if (!showId) {
      setSeatsLoading(false);
      return;
    }

    setSeatsLoading(true);

    api(`/bookings/show/${showId}/seats`)
      .then((data) => setBusySeats(data.bookedSeats || []))
      .catch((e) => setError(e.message))
      .finally(() => setSeatsLoading(false));
  }, [showId]);

  const date = saved.date || new Date().toISOString().slice(0, 10);
  const time = saved.time || times[2];
  const theatre = saved.theatre || theatres[0];
  const price = Number(saved.price ?? 220);
  const rows = ["A", "B", "C", "D", "E", "F"];

  const toggle = (seat) => {
    if (busySeats.includes(seat)) return;

    setSelected((old) =>
      old.includes(seat)
        ? old.filter((s) => s !== seat)
        : old.length >= 10
          ? old
          : [...old, seat],
    );
  };

  const confirm = async () => {
    setError("");

    if (!user) {
      return navigate("/login", {
        state: { from: `/book/${id}`, ...saved },
      });
    }

    if (!showId || !Number.isFinite(showId)) {
      return setError(
        "Show information is missing. Please select a show again.",
      );
    }

    if (!selected.length) {
      return setError("Choose at least one seat to continue.");
    }

    setSubmitting(true);

    try {
      const result = await api("/bookings", {
        method: "POST",
        body: JSON.stringify({ showId, seats: selected }),
      });

      setPendingBooking(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const processPayment = async (paymentSuccess) => {
    if (!pendingBooking) return;

    setError("");
    setPaying(true);

    try {
      await api(`/bookings/${pendingBooking.id}/mock-payment`, {
        method: "POST",
        body: JSON.stringify({ success: paymentSuccess }),
      });

      if (paymentSuccess) {
        setBusySeats((old) => [...new Set([...old, ...selected])]);
        notify("Your booking has been confirmed!");
      } else {
        notify("Payment failed. Your booking was cancelled.", "error");
      }

      setPaymentResult({
        success: paymentSuccess,
        bookingCode: pendingBooking.bookingCode,
      });

      setSelected([]);
      setPendingBooking(null);
    } catch (e) {
      setError(e.message);
      notify(e.message, "error");
    } finally {
      setPaying(false);
    }
  };

  if (!movie) {
    return (
      <main className="inner-page">
        <h1>Movie not found</h1>
        <Link to="/movies">Back to movies</Link>
      </main>
    );
  }

  return (
    <main className="inner-page booking-page">
      <Link className="back-link" to={`/movies/${id}`}>
        ← Back to show details
      </Link>

      <div className="page-heading compact">
        <div className="section-kicker">YOUR MOVIE NIGHT</div>
        <h1>
          {paymentResult ? (
            <>
              Booking{" "}
              <span>{paymentResult.success ? "confirmed." : "cancelled."}</span>
            </>
          ) : pendingBooking ? (
            <>
              Complete your <span>payment.</span>
            </>
          ) : (
            <>
              Pick your <span>perfect seat.</span>
            </>
          )}
        </h1>
        <p>
          {movie.title} · {date} · {time}
        </p>
      </div>

      {paymentResult ? (
        <div
          className="booking-summary"
          style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}
        >
          <div className="section-kicker">
            {paymentResult.success
              ? "PAYMENT SUCCESSFUL"
              : "PAYMENT UNSUCCESSFUL"}
          </div>

          <div style={{ fontSize: "42px", margin: "16px 0" }}>
            {paymentResult.success ? "✓" : "×"}
          </div>

          <h2>
            {paymentResult.success
              ? "Your booking is confirmed!"
              : "Your booking was cancelled"}
          </h2>

          <p className="summary-muted">
            {paymentResult.success
              ? "Your movie ticket is ready. Visit My Bookings to view your QR ticket."
              : "No ticket has been issued for this booking. You can try booking again."}
          </p>

          <div className="summary-line">
            <span>Booking ID</span>
            <strong>{paymentResult.bookingCode}</strong>
          </div>

          <Link
            to="/my-bookings"
            className="btn btn-primary btn-wide"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            View my bookings <ArrowRight size={17} />
          </Link>

          <Link
            to={`/movies/${id}`}
            className="btn btn-wide"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "12px",
            }}
          >
            Back to movie details
          </Link>
        </div>
      ) : !pendingBooking ? (
        <div className="seat-layout">
          <div className="seat-main">
            <div className="screen-area">
              <div className="screen-glow"></div>
              <div className="screen-shape"></div>
              <span>SCREEN THIS WAY</span>
            </div>

            <div className="seat-rows">
              {rows.map((row) => (
                <div className="seat-row" key={row}>
                  <span className="row-label">{row}</span>

                  {Array.from({ length: 8 }, (_, i) => `${row}${i + 1}`).map(
                    (seat) => (
                      <button
                        aria-label={`Seat ${seat}`}
                        title={seat}
                        key={seat}
                        disabled={seatsLoading || busySeats.includes(seat)}
                        onClick={() => toggle(seat)}
                        className={`seat ${
                          busySeats.includes(seat)
                            ? "booked"
                            : selected.includes(seat)
                              ? "chosen"
                              : ""
                        }`}
                      >
                        <Armchair size={15} />
                      </button>
                    ),
                  )}

                  <span className="row-label">{row}</span>
                </div>
              ))}
            </div>

            {seatsLoading && <p>Loading seat availability...</p>}

            <div className="seat-legend">
              <span>
                <i className="legend-seat available"></i> Available
              </span>
              <span>
                <i className="legend-seat chosen"></i> Selected
              </span>
              <span>
                <i className="legend-seat booked"></i> Occupied
              </span>
            </div>
          </div>

          <aside className="booking-summary">
            <div className="section-kicker">BOOKING SUMMARY</div>
            <h2>{movie.title}</h2>
            <p className="summary-muted">{theatre}</p>

            <div className="summary-line">
              <span>
                <CalendarDays size={16} /> Date
              </span>
              <strong>{date}</strong>
            </div>

            <div className="summary-line">
              <span>
                <Clock3 size={16} /> Showtime
              </span>
              <strong>{time}</strong>
            </div>

            <div className="summary-line">
              <span>
                <Armchair size={16} /> Seats
              </span>
              <strong>
                {selected.length ? selected.join(", ") : "None selected"}
              </strong>
            </div>

            <div className="summary-total">
              <span>Total amount</span>
              <strong>₹{selected.length * price}</strong>
            </div>

            <p className="summary-small">
              ₹{price} per seat · Demo payment only.
            </p>

            {error && <div className="notice notice-error">{error}</div>}

            <button
              className="btn btn-primary btn-wide"
              onClick={confirm}
              disabled={submitting || seatsLoading}
            >
              {submitting ? "Creating booking…" : "Proceed to payment"}
              <ArrowRight size={17} />
            </button>
          </aside>
        </div>
      ) : (
        <div
          className="booking-summary"
          style={{ maxWidth: "520px", margin: "0 auto" }}
        >
          <div className="section-kicker">CINEBOOK MOCK CHECKOUT</div>
          <h2>Complete your booking</h2>
          <p className="summary-muted">
            This is a simulated payment. No real money will be charged.
          </p>

          <div className="summary-line">
            <span>Booking ID</span>
            <strong>{pendingBooking.bookingCode}</strong>
          </div>

          <div className="summary-line">
            <span>Selected seats</span>
            <strong>{selected.join(", ")}</strong>
          </div>

          <div className="summary-total">
            <span>Amount to pay</span>
            <strong>₹{pendingBooking.totalAmount}</strong>
          </div>

          <p className="summary-small">
            Choose a result to test the demo payment flow.
          </p>

          {error && <div className="notice notice-error">{error}</div>}

          <button
            className="btn btn-primary btn-wide"
            onClick={() => processPayment(true)}
            disabled={paying}
          >
            {paying ? "Processing…" : "✓ Simulate Payment Success"}
          </button>

          <button
            className="btn btn-wide"
            style={{ marginTop: "12px" }}
            onClick={() => processPayment(false)}
            disabled={paying}
          >
            Simulate Payment Failure
          </button>
        </div>
      )}

      <Footer />
    </main>
  );
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate();
  const location = window.history.state?.usr || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const data = await api(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      localStorage.setItem("cinebook_token", data.token);
      onAuth(data.user);
      notify(
        mode === "login"
          ? "Welcome back to CineBook!"
          : "Your account has been created successfully!",
      );
      navigate(location.from || "/", { state: location, replace: true });
    } catch (err) {
      setError(err.message);
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-art">
        <div className="auth-art-overlay"></div>
        <div className="auth-art-copy">
          <span className="brand brand-light">
            <span className="brand-mark">
              <Ticket size={21} />
            </span>
            <span>
              Cine<span>Book</span>
            </span>
          </span>
          <h1>
            Every great story
            <br />
            starts with a <span>seat.</span>
          </h1>
          <p>
            Your next unforgettable cinema moment is just around the corner.
          </p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <div className="section-kicker">
            {mode === "login" ? "WELCOME BACK" : "JOIN THE EXPERIENCE"}
          </div>
          <h2>
            {mode === "login" ? "Good to see you." : "Create your account."}
          </h2>
          <p>
            {mode === "login"
              ? "Sign in to pick up where your movie night left off."
              : "Save your bookings and make every movie night easy."}
          </p>

          {mode === "register" && (
            <>
              <label className="field-label">Full name</label>
              <input
                className="field-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </>
          )}

          <label className="field-label">Email address</label>
          <input
            className="field-input"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <label className="field-label">Password</label>
          <input
            className="field-input"
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />

          {error && <div className="notice notice-error">{error}</div>}

          <button className="btn btn-primary btn-wide" disabled={busy}>
            {busy
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}{" "}
            <ArrowRight size={17} />
          </button>

          {mode === "login" && (
            <Link
              to="/admin/login"
              className="btn btn-outline btn-wide"
              style={{ marginTop: "14px" }}
            >
              <ShieldCheck size={17} />
              Admin Portal
              <ArrowRight size={17} />
            </Link>
          )}

          <div className="auth-switch">
            {mode === "login" ? (
              <>
                New to CineBook? <Link to="/register">Create an account</Link>
              </>
            ) : (
              <>
                Already have an account? <Link to="/login">Sign in</Link>
              </>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

function AdminLogin({ onAuth }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const data = await api("/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.user.role !== "admin") {
        throw new Error("Admin access denied.");
      }

      localStorage.setItem("cinebook_token", data.token);
      onAuth(data.user);
      notify("Welcome to the CineBook admin panel!");
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-visual">
        <div className="admin-brand">
          <span className="brand-mark">
            <Ticket size={21} />
          </span>
          <div>
            Cine<span>Book</span>
          </div>
        </div>
        <div className="admin-visual-content">
          <div className="section-kicker">CINEBOOK MANAGEMENT</div>
          <h1>
            Your cinema,
            <br />
            <span> Your control. </span>
          </h1>
          <p>
            Manage movies, theatres, showtimes and bookings through your
            dedicated administration panel.
          </p>
        </div>
        <div className="admin-visual-footer">
          CINEBOOK ADMINISTRATION PORTAL
        </div>
      </section>
      <section className="admin-login-form-area">
        <form className="admin-login-form" onSubmit={submit}>
          <div className="admin-login-icon">
            <ShieldCheck size={27} />
          </div>
          <div className="section-kicker">ADMINISTRATOR ACCESS</div>

          <h2> Welcome back.</h2>
          <p>
            Sign in to access your CineBook control panel. This portal is
            exclusively for administrators.
          </p>
          <label className="field-label">Admin email address</label>
          <input
            className="field-input"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your admin email"
          />
          <label className="field-label">Password</label>
          <input
            className="field-input"
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {error && <div className="notice notice-error">{error}</div>}
          <button className="btn btn-primary btn-wide" disabled={busy}>
            {busy ? "Please wait…" : "Access Admin Panel"}{" "}
            <ArrowRight size={17} />
          </button>
          <Link to="/" className="admin-login-back">
            ← Back to CineBook
          </Link>
        </form>
      </section>
    </main>
  );
}

function AdminDashboard({ user, onLogout }) {
  const emptyForm = {
    title: "",
    genre: "",
    language: "",
    duration: "",
    rating: "",
    releaseYear: "",
    certificate: "",
    posterUrl: "",
    bannerUrl: "",
    description: "",
    director: "",
    price: "200",
    status: "Now Showing",
  };

  const [movies, setMovies] = useState([]);
  const [overview, setOverview] = useState(null);
  const [adminBookings, setAdminBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  const [shows, setShows] = useState([]);
  const [showOptions, setShowOptions] = useState({ movies: [], screens: [] });
  const [cities, setCities] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheatreIds, setSelectedTheatreIds] = useState([]);
  const [selectedScreens, setSelectedScreens] = useState({});

  const [showDate, setShowDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [showForm, setShowForm] = useState({
    movieId: "",
    screenId: "",
    date: "",
    time: "09:00",
    price: "200",
    format: "2D",
  });

  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  const [creatingShow, setCreatingShow] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showError, setShowError] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("ALL");
  const [bookingDateFilter, setBookingDateFilter] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const loadOverview = async () => {
    try {
      setOverviewError("");

      const data = await api("/admin/overview");
      setOverview(data);
    } catch (err) {
      setOverviewError(err.message || "Could not load dashboard statistics.");
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadAdminBookings = async () => {
    setBookingsLoading(true);
    setBookingsError("");

    try {
      const data = await api("/admin/bookings");
      setAdminBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setBookingsError(err.message || "Could not load bookings.");
    } finally {
      setBookingsLoading(false);
    }
  };

  const exportBookingsCSV = () => {
    const headers = [
      "Booking ID",
      "Customer",
      "Email",
      "Movie",
      "Theatre",
      "Show Date",
      "Show Time",
      "Seats",
      "Amount",
      "Status",
      "Booking Created",
    ];

    const rows = adminBookings.map((booking) => [
      booking.bookingCode,
      booking.customerName,
      booking.customerEmail,
      booking.movieTitle,
      booking.theatre,
      booking.showDate,
      booking.showTime,
      booking.seats,
      booking.totalAmount,
      booking.status,
      booking.createdAt,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CineBook-Bookings.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const loadMovies = async () => {
    try {
      const data = await api("/movies");
      setMovies(data);
    } catch (err) {
      setError(err.message || "Could not load movies.");
      notify(err.message || "Could not load movies.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadShowOptions = async () => {
    try {
      const data = await api("/shows/options");
      setShowOptions(data);
    } catch (err) {
      setShowError(err.message || "Could not load movies and screens.");
      notify(err.message || "Could not load movies and screens.", "error");
    }
  };

  const loadShows = async (date = showDate) => {
    if (!date) return;

    setShowError("");
    setShowsLoading(true);

    try {
      const data = await api(`/shows?date=${date}`);
      setShows(Array.isArray(data) ? data : []);
    } catch (err) {
      setShowError(err.message || "Could not load shows.");
      notify(err.message || "Could not load shows.", "error");
    } finally {
      setShowsLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
    loadAdminBookings();
    loadMovies();
    loadShowOptions();
    loadShows(new Date().toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    api("/theatres/cities")
      .then((data) => {
        console.log("Cities received:", data);

        const cityList = Array.isArray(data)
          ? data
          : Array.isArray(data.cities)
            ? data.cities
            : [];

        setCities(cityList);

        setSelectedCity((current) =>
          cityList.includes(current) ? current : cityList[0] || "",
        );
      })
      .catch((error) => {
        console.error("Failed to load cities:", error);
        setCities([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedCity) return;

    setTheatres([]);
    setSelectedTheatreIds([]);
    setSelectedScreens({});

    api(`/theatres?city=${encodeURIComponent(selectedCity)}`)
      .then((data) => {
        setTheatres(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setShowError(err.message || "Could not load cinemas.");
      });
  }, [selectedCity]);

  const handleCreateShow = async (e) => {
    e.preventDefault();
    setShowError("");
    setShowMessage("");

    if (!showForm.movieId || !showForm.date || !selectedTheatreIds.length) {
      setShowError("Please select movie, date and at least one cinema.");
      return;
    }

    const selectedScreenIds = selectedTheatreIds.flatMap(
      (theatreId) => selectedScreens[theatreId] || [],
    );

    if (!selectedScreenIds.length) {
      setShowError("Please select at least one screen.");
      return;
    }

    if (
      selectedTheatreIds.some(
        (theatreId) => !selectedScreens[theatreId]?.length,
      )
    ) {
      setShowError("Please select at least one screen for every cinema.");
      return;
    }

    setCreatingShow(true);

    try {
      for (const screenId of selectedScreenIds) {
        await api("/shows", {
          method: "POST",
          body: JSON.stringify({
            movieId: Number(showForm.movieId),
            screenId: Number(screenId),
            startsAt: `${showForm.date} ${showForm.time}:00`,
            price: Number(showForm.price),
            format: showForm.format,
          }),
        });
      }

      setShowMessage(
        `Show created successfully on ${selectedScreenIds.length} screens across ${selectedTheatreIds.length} cinemas!`,
      );

      notify("Shows scheduled successfully!");
      setShowDate(showForm.date);
      await loadShows(showForm.date);

      setSelectedTheatreIds([]);
      setSelectedScreens({});
      setShowForm({
        movieId: "",
        date: "",
        time: "09:00",
        price: "200",
        format: "2D",
      });
    } catch (err) {
      setShowError(err.message || "Could not create all shows.");
      notify(err.message || "Could not create all shows.", "error");
    } finally {
      setCreatingShow(false);
    }
  };

  const getScreensForTheatre = (theatreId) =>
    showOptions.screens.filter(
      (screen) => String(screen.theatreId) === String(theatreId),
    );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPayload = () => ({
    ...form,
    duration: Number(form.duration),
    rating: form.rating ? Number(form.rating) : null,
    releaseYear: Number(form.releaseYear),
    price: Number(form.price),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    try {
      if (editingId !== null) {
        await api(`/movies/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(getPayload()),
        });

        setMessage("Movie changes saved successfully!");
        notify("Movie updated successfully!");
      } else {
        await api("/movies", {
          method: "POST",
          body: JSON.stringify(getPayload()),
        });

        setMessage("Movie added successfully!");
        notify("Movie added successfully!");
      }

      resetForm();
      await loadMovies();
      await loadShowOptions();
    } catch (err) {
      setError(err.message || "Could not save movie.");
      notify(err.message || "Could not save movie.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleEditMovie = (movie) => {
    setEditingId(movie.id);

    setForm({
      title: movie.title || "",
      genre: movie.genre || "",
      language: movie.language || "",
      duration: String(movie.duration ?? ""),
      rating: movie.rating == null ? "" : String(movie.rating),
      releaseYear: String(movie.releaseYear ?? ""),
      certificate: movie.certificate || "",
      posterUrl: movie.posterUrl || "",
      bannerUrl: movie.bannerUrl || "",
      description: movie.description || "",
      director: movie.director || "",
      price: String(movie.price ?? 200),
      status: movie.status || "Now Showing",
    });

    setError("");
    setMessage("Editing: " + movie.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMovie = async (movie) => {
    if (!window.confirm(`Delete "${movie.title}" from CineBook?`)) return;

    setError("");
    setMessage("");
    setBusy(true);

    try {
      await api(`/movies/${movie.id}`, { method: "DELETE" });

      if (editingId === movie.id) resetForm();

      setMessage("Movie deleted successfully.");
      notify("Movie deleted successfully!");
      await loadMovies();
      await loadShowOptions();
    } catch (err) {
      setError(
        err.message ||
          "Could not delete movie. It may be linked to existing shows or bookings.",
      );
      notify(err.message || "Could not delete movie.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="inner-page admin-dashboard-page">
      <div className="page-heading">
        <div className="section-kicker">CINEBOOK ADMIN PANEL</div>
        <h1>
          Welcome, <span>{user.name}.</span>
        </h1>
        <p>Manage your CineBook movies and showtimes.</p>
      </div>

      {/* ADMIN OVERVIEW */}
      <div className="booking-summary" style={{ marginTop: 25 }}>
        <h2>Dashboard Overview</h2>
        <p>Live statistics from your CineBook database.</p>

        {overviewLoading ? (
          <p>Loading dashboard statistics...</p>
        ) : overviewError ? (
          <div className="notice notice-error">{overviewError}</div>
        ) : overview ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 15,
                marginTop: 20,
              }}
            >
              {[
                { label: "Total Movies", value: overview.totalMovies },
                { label: "Total Shows", value: overview.totalShows },
                { label: "Total Bookings", value: overview.totalBookings },
                { label: "Total Customers", value: overview.totalCustomers },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: 18,
                    border: "1px solid #29354b",
                    borderRadius: 12,
                    background: "#111c30",
                  }}
                >
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: 13 }}>
                    {item.label}
                  </p>
                  <h2 style={{ margin: "10px 0 0", fontSize: 28 }}>
                    {item.value}
                  </h2>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: 25 }}>Booking Statistics</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 15,
                marginTop: 15,
              }}
            >
              {[
                { label: "Confirmed", value: overview.confirmedBookings },
                { label: "Pending", value: overview.pendingBookings },
                { label: "Cancelled", value: overview.cancelledBookings },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: 18,
                    border: "1px solid #29354b",
                    borderRadius: 12,
                    background: "#111c30",
                  }}
                >
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: 13 }}>
                    {item.label} Bookings
                  </p>
                  <h2 style={{ margin: "10px 0 0", fontSize: 28 }}>
                    {item.value}
                  </h2>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                padding: 20,
                border: "1px solid #29354b",
                borderRadius: 12,
                background: "#111c30",
              }}
            >
              <p style={{ color: "#94a3b8", margin: 0, fontSize: 13 }}>
                Total Confirmed Revenue
              </p>
              <h2 style={{ margin: "10px 0 0", fontSize: 30 }}>
                ₹{Number(overview.totalRevenue).toLocaleString("en-IN")}
              </h2>
            </div>
          </>
        ) : null}
      </div>

      {/* MOVIE FORM */}
      <div className="booking-summary">
        <h2>{editingId !== null ? "Edit Movie" : "Add New Movie"}</h2>
        <p>
          {editingId !== null
            ? "Update movie details and save changes."
            : "Enter movie details to publish it on CineBook."}
        </p>

        <form onSubmit={handleSaveMovie}>
          <label className="field-label">Movie Title *</label>
          <input
            className="field-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label className="field-label">Genre *</label>
          <input
            className="field-input"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            required
          />

          <label className="field-label">Language *</label>
          <input
            className="field-input"
            name="language"
            value={form.language}
            onChange={handleChange}
            required
          />

          <label className="field-label">Duration (minutes) *</label>
          <input
            className="field-input"
            type="number"
            min="1"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
          />

          <label className="field-label">Release Year *</label>
          <input
            className="field-input"
            type="number"
            min="1888"
            max="2155"
            name="releaseYear"
            value={form.releaseYear}
            onChange={handleChange}
            required
          />

          <label className="field-label">Rating</label>
          <input
            className="field-input"
            type="number"
            min="0"
            max="10"
            step="0.1"
            name="rating"
            value={form.rating}
            onChange={handleChange}
          />

          <label className="field-label">Certificate</label>
          <input
            className="field-input"
            name="certificate"
            value={form.certificate}
            onChange={handleChange}
          />

          <label className="field-label">Director</label>
          <input
            className="field-input"
            name="director"
            value={form.director}
            onChange={handleChange}
          />

          <label className="field-label">Poster Image URL</label>
          <input
            className="field-input"
            type="url"
            name="posterUrl"
            value={form.posterUrl}
            onChange={handleChange}
          />

          <label className="field-label">Backdrop Image URL</label>
          <input
            className="field-input"
            type="url"
            name="bannerUrl"
            value={form.bannerUrl}
            onChange={handleChange}
          />

          <label className="field-label">Description</label>
          <textarea
            className="field-input"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />

          <label className="field-label">Ticket Price (₹)</label>
          <input
            className="field-input"
            type="number"
            min="0"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
          />

          <label className="field-label">Movie Status</label>
          <select
            className="field-input"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Now Showing">Now Showing</option>
            <option value="Coming Soon">Coming Soon</option>
          </select>

          {error && <div className="notice notice-error">{error}</div>}
          {message && <div className="notice notice-success">{message}</div>}

          <button className="btn btn-primary btn-wide" disabled={busy}>
            {busy
              ? "Please wait..."
              : editingId !== null
                ? "Save Changes"
                : "Add Movie"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="btn btn-outline btn-wide"
              onClick={resetForm}
              disabled={busy}
              style={{ marginTop: 10 }}
            >
              Cancel Editing
            </button>
          )}
        </form>
      </div>

      {/* MOVIE COLLECTION */}
      <div className="booking-summary" style={{ marginTop: 30 }}>
        <h2>Movie Collection</h2>
        <p>Edit movie details, update poster URLs or delete movies.</p>

        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          movies.map((movie) => (
            <div
              key={movie.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 15,
                padding: "15px 0",
                borderBottom: "1px solid #29354b",
                flexWrap: "nowrap",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  minWidth: 0,
                  flex: "1 1 auto",
                }}
              >
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    style={{
                      width: 48,
                      height: 68,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                )}

                <div>
                  <strong>{movie.title}</strong>
                  <p
                    style={{ color: "#94a3b8", fontSize: 12, margin: "5px 0" }}
                  >
                    {movie.genre} · {movie.language} · {movie.releaseYear}
                  </p>
                  <span className="status-pill">{movie.status}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  marginLeft: "auto",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleEditMovie(movie)}
                  disabled={busy}
                >
                  Edit Movie
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleDeleteMovie(movie)}
                  disabled={busy}
                >
                  Delete Movie
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SHOW MANAGEMENT */}
      <div className="booking-summary" style={{ marginTop: 30 }}>
        <h2>Manage Shows</h2>
        <p>Schedule movie shows across different dates and screens.</p>

        <form onSubmit={handleCreateShow}>
          <label className="field-label">Select Movie *</label>
          <select
            className="field-input"
            value={showForm.movieId}
            onChange={(e) => {
              const movie = showOptions.movies.find(
                (m) => m.id === Number(e.target.value),
              );

              setShowForm({
                ...showForm,
                movieId: e.target.value,
                price: String(movie?.base_price || 200),
              });
            }}
            required
          >
            <option value="">Choose Movie</option>
            {showOptions.movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>

          <label className="field-label">Select City *</label>
          <select
            className="field-input"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            required
          >
            <option value="">Choose City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <label className="field-label">Select Cinemas *</label>

          <div
            className="booking-summary"
            style={{ padding: 15, marginTop: 10 }}
          >
            {theatres.map((theatre) => {
              const theatreId = String(theatre.id);
              const screens = getScreensForTheatre(theatreId);
              const isSelected = selectedTheatreIds.includes(theatreId);

              return (
                <div key={theatre.id} style={{ marginBottom: 16 }}>
                  <label
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTheatreIds((prev) => [...prev, theatreId]);
                        } else {
                          setSelectedTheatreIds((prev) =>
                            prev.filter((id) => id !== theatreId),
                          );

                          setSelectedScreens((prev) => {
                            const updated = { ...prev };
                            delete updated[theatreId];
                            return updated;
                          });
                        }
                      }}
                    />
                    <strong>{theatre.name}</strong>
                  </label>

                  {isSelected && (
                    <div style={{ marginLeft: 28, marginTop: 10 }}>
                      <label className="field-label">Select Screens *</label>

                      <div
                        style={{
                          padding: 12,
                          border: "1px solid #29354b",
                          borderRadius: 8,
                          marginTop: 8,
                        }}
                      >
                        {screens.map((screen) => {
                          const screenId = String(screen.id);
                          const theatreScreens =
                            selectedScreens[theatreId] || [];
                          const isScreenSelected =
                            theatreScreens.includes(screenId);

                          return (
                            <label
                              key={screen.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 10,
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isScreenSelected}
                                onChange={(e) => {
                                  setSelectedScreens((prev) => {
                                    const currentScreens =
                                      prev[theatreId] || [];

                                    return {
                                      ...prev,
                                      [theatreId]: e.target.checked
                                        ? [...currentScreens, screenId]
                                        : currentScreens.filter(
                                            (id) => id !== screenId,
                                          ),
                                    };
                                  });
                                }}
                              />

                              <span>{screen.name}</span>
                            </label>
                          );
                        })}
                      </div>

                      <p style={{ color: "#94a3b8", fontSize: 13 }}>
                        {selectedScreens[theatreId]?.length || 0} screens
                        selected
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            <p>{selectedTheatreIds.length} cinemas selected</p>
          </div>

          <label className="field-label">Show Date *</label>
          <input
            className="field-input"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={showForm.date}
            onChange={(e) => setShowForm({ ...showForm, date: e.target.value })}
            required
          />

          <label className="field-label">Show Time *</label>
          <input
            className="field-input"
            type="time"
            value={showForm.time}
            onChange={(e) => setShowForm({ ...showForm, time: e.target.value })}
            required
          />

          <label className="field-label">Ticket Price (₹) *</label>
          <input
            className="field-input"
            type="number"
            min="1"
            step="0.01"
            value={showForm.price}
            onChange={(e) =>
              setShowForm({ ...showForm, price: e.target.value })
            }
            required
          />

          <label className="field-label">Format</label>
          <select
            className="field-input"
            value={showForm.format}
            onChange={(e) =>
              setShowForm({ ...showForm, format: e.target.value })
            }
          >
            <option value="2D">2D</option>
            <option value="3D">3D</option>
            <option value="IMAX">IMAX</option>
          </select>

          {showError && <div className="notice notice-error">{showError}</div>}

          {showMessage && (
            <div className="notice notice-success">{showMessage}</div>
          )}

          <button
            className="btn btn-primary btn-wide"
            disabled={creatingShow}
            style={{ marginTop: 15 }}
          >
            {creatingShow ? "Creating Show..." : "Create Show"}
          </button>
        </form>

        <hr style={{ margin: "25px 0", borderColor: "#29354b" }} />

        <h3>View Scheduled Shows</h3>

        <label className="field-label">Select Date</label>
        <input
          className="field-input"
          type="date"
          value={showDate}
          onChange={(e) => {
            setShowDate(e.target.value);
            setShows([]);
          }}
        />

        <button
          type="button"
          className="btn btn-outline btn-wide"
          onClick={() => loadShows()}
          disabled={showsLoading}
          style={{ marginTop: 12 }}
        >
          {showsLoading ? "Loading..." : "View Shows"}
        </button>

        {showError && (
          <div className="notice notice-error" style={{ marginTop: 15 }}>
            {showError}
          </div>
        )}

        {!showsLoading && shows.length === 0 && (
          <p style={{ marginTop: 15 }}>No shows found for this date.</p>
        )}

        {shows.map((show) => (
          <div
            key={show.id}
            style={{
              padding: "14px 0",
              borderBottom: "1px solid #29354b",
            }}
          >
            <strong>{show.movieTitle}</strong>

            <p style={{ color: "#94a3b8", fontSize: 13, margin: "5px 0" }}>
              {show.theatreName} · {show.screenName}
            </p>

            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
              {new Date(show.startsAt).toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
              })}
              {" · "}₹{show.price} · {show.language} · {show.format}
            </p>
          </div>
        ))}
      </div>

      {/* BOOKING MANAGEMENT */}
      <div className="booking-summary" style={{ marginTop: 30 }}>
        <h2>Booking Management</h2>
        <p>View all customer bookings and their details.</p>

        <input
          className="field-input"
          type="text"
          placeholder="Search by customer, email, movie or booking ID..."
          value={bookingSearch}
          onChange={(e) => setBookingSearch(e.target.value)}
          style={{ marginTop: 15 }}
        />

        <button
          type="button"
          className="btn btn-primary"
          onClick={exportBookingsCSV}
          style={{ marginTop: 15 }}
        >
          <Download size={16} /> Export Bookings CSV
        </button>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 15,
          }}
        >
          {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map((status) => (
            <button
              key={status}
              type="button"
              className={
                bookingStatusFilter === status
                  ? "btn btn-primary"
                  : "btn btn-outline"
              }
              onClick={() => setBookingStatusFilter(status)}
            >
              {status === "ALL" ? "All Bookings" : status}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Filter by Booking Date
          </label>

          <input
            type="date"
            className="field-input"
            value={bookingDateFilter}
            onChange={(e) => setBookingDateFilter(e.target.value)}
          />

          {bookingDateFilter && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setBookingDateFilter("")}
              style={{ marginLeft: 10 }}
            >
              Clear Date
            </button>
          )}
        </div>

        {bookingsLoading ? (
          <p>Loading bookings...</p>
        ) : bookingsError ? (
          <div className="notice notice-error">{bookingsError}</div>
        ) : (
          (() => {
            const filteredBookings = adminBookings.filter((booking) => {
              const matchesSearch = [
                booking.bookingCode,
                booking.customerName,
                booking.customerEmail,
                booking.movieTitle,
                booking.status,
              ]
                .join(" ")
                .toLowerCase()
                .includes(bookingSearch.toLowerCase());

              const matchesStatus =
                bookingStatusFilter === "ALL" ||
                booking.status === bookingStatusFilter;

              const matchesDate =
                !bookingDateFilter || booking.bookingDate === bookingDateFilter;

              return matchesSearch && matchesStatus && matchesDate;
            });

            return filteredBookings.length === 0 ? (
              <p style={{ marginTop: 20 }}>No bookings found.</p>
            ) : (
              <div
                style={{
                  marginTop: 20,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 14,
                  alignItems: "start",
                }}
              >
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    style={{
                      padding: 16,
                      border: "1px solid #29354b",
                      borderRadius: 10,
                      background: "#111c30",
                    }}
                  >
                    {/* Compact Booking Card */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <strong>{booking.movieTitle}</strong>
                      <span className="status-pill">{booking.status}</span>
                    </div>

                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: 12,
                        margin: "8px 0",
                      }}
                    >
                      Booking ID: {booking.bookingCode}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <strong>{booking.customerName}</strong>
                      <span style={{ fontSize: 13 }}>
                        {booking.showDate
                          ? new Date(booking.showDate).toLocaleDateString(
                              "en-IN",
                            )
                          : "N/A"}
                      </span>
                    </div>

                    <p style={{ marginTop: 10, fontWeight: 700 }}>
                      ₹{Number(booking.totalAmount).toLocaleString("en-IN")}
                    </p>

                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ marginTop: 12 }}
                      onClick={() =>
                        setSelectedBookingId(
                          selectedBookingId === booking.id ? null : booking.id,
                        )
                      }
                    >
                      {selectedBookingId === booking.id
                        ? "Hide Details"
                        : "View Details"}
                    </button>

                    {selectedBookingId === booking.id && (
                      <div
                        style={{
                          position: "fixed",
                          inset: 0,
                          zIndex: 9999,
                          background: "rgba(0, 0, 0, 0.75)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 20,
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            maxWidth: 520,
                            maxHeight: "85vh",
                            overflowY: "auto",
                            padding: 25,
                            borderRadius: 14,
                            background: "#111c30",
                            border: "1px solid #334563",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 20,
                            }}
                          >
                            <h3 style={{ margin: 0 }}>
                              Complete Booking Details
                            </h3>

                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => setSelectedBookingId(null)}
                            >
                              ✕
                            </button>
                          </div>

                          <p>
                            <strong>Booking ID:</strong> {booking.bookingCode}
                          </p>
                          <p>
                            <strong>Customer:</strong> {booking.customerName}
                          </p>
                          <p>
                            <strong>Email:</strong> {booking.customerEmail}
                          </p>
                          <p>
                            <strong>Movie:</strong> {booking.movieTitle}
                          </p>
                          <p>
                            <strong>Theatre:</strong> {booking.theatre}
                          </p>

                          <p>
                            <strong>Show Date:</strong>{" "}
                            {booking.showDate
                              ? new Date(booking.showDate).toLocaleDateString(
                                  "en-IN",
                                )
                              : "N/A"}
                          </p>

                          <p>
                            <strong>Show Time:</strong>{" "}
                            {booking.showTime || "N/A"}
                          </p>
                          <p>
                            <strong>Seats:</strong> {booking.seats || "N/A"}
                          </p>

                          <p>
                            <strong>Amount:</strong> ₹
                            {Number(booking.totalAmount).toLocaleString(
                              "en-IN",
                            )}
                          </p>

                          <p>
                            <strong>Status:</strong> {booking.status}
                          </p>

                          <p>
                            <strong>Booking Created:</strong>{" "}
                            {booking.createdAt
                              ? new Date(booking.createdAt).toLocaleString(
                                  "en-IN",
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>

      <button
        className="btn btn-outline"
        onClick={onLogout}
        style={{ marginTop: 25 }}
      >
        <LogOut size={16} /> Logout
      </button>
    </main>
  );
}

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [message, setMessage] = useState("");
  const [viewingTicket, setViewingTicket] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    api("/bookings/mine")
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const cancelBooking = async (bookingId) => {
    setCancelling(bookingId);
    setError("");
    setMessage("");

    try {
      const result = await api(`/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      setBookings((old) =>
        old.map((b) =>
          b.id === bookingId ? { ...b, status: "CANCELLED" } : b,
        ),
      );

      if (viewingTicket?.id === bookingId) {
        setViewingTicket(null);
      }

      setMessage(result.message);
      notify("Your booking has been cancelled successfully!");
    } catch (e) {
      setError(e.message);
      notify(e.message, "error");
    } finally {
      setCancelling(null);
    }
  };

  if (!user) {
    return (
      <main className="inner-page admin-dashboard">
        <div className="empty-state">
          <Ticket size={34} />
          <h3>Sign in to see your bookings</h3>
          <p>Your tickets will be waiting here.</p>
          <Link className="btn btn-primary" to="/login">
            Sign in
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="inner-page">
      <div className="page-heading compact">
        <div className="section-kicker">YOUR CINEBOOK ACCOUNT</div>
        <h1>
          Movie nights, <span>saved.</span>
        </h1>
        <p>All your upcoming cinema plans, in one place.</p>
      </div>

      {error && <div className="notice notice-warn">{error}</div>}
      {message && <div className="notice notice-success">{message}</div>}

      {loading ? (
        <div className="loading-state">Finding your tickets…</div>
      ) : bookings.length ? (
        <div className="booking-list">
          {bookings.map((b) => (
            <article className="booking-ticket" key={b.id}>
              <img src={b.posterUrl} alt="" />

              <div className="booking-ticket-info">
                <span className="section-kicker">BOOKING {b.bookingCode}</span>

                <h3>{b.title}</h3>

                <p>
                  <CalendarDays size={15} />
                  {String(b.showDate).slice(0, 10)}
                  <span>·</span>
                  <Clock3 size={15} />
                  {b.showTime}
                </p>

                <p>
                  <MapPin size={15} />
                  {b.theatre}
                </p>

                <p>
                  <Armchair size={15} />
                  Seats: {b.seats}
                </p>
              </div>

              <div className="booking-ticket-price">
                <span className="status-pill">{b.status}</span>

                <strong>₹{Number(b.totalAmount).toFixed(0)}</strong>

                {b.status === "CONFIRMED" && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => setViewingTicket(b)}
                    >
                      View Ticket
                    </button>

                    <button
                      className="btn btn-secondary"
                      disabled={cancelling === b.id}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to cancel this booking?",
                          )
                        ) {
                          cancelBooking(b.id);
                        }
                      }}
                    >
                      {cancelling === b.id ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  </>
                )}

                {b.status === "PENDING" && (
                  <p className="summary-small">
                    Payment pending. No ticket issued yet.
                  </p>
                )}

                {b.status === "CANCELLED" && (
                  <p className="summary-small">
                    This booking has been cancelled.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Ticket size={34} />
          <h3>No bookings yet</h3>
          <p>Your next movie night is waiting to happen.</p>

          <Link className="btn btn-primary" to="/movies">
            Explore movies
          </Link>
        </div>
      )}

      {viewingTicket && viewingTicket.status === "CONFIRMED" && (
        <div className="ticket-modal-overlay">
          <div className="digital-ticket">
            <button
              className="ticket-close"
              onClick={() => setViewingTicket(null)}
            >
              <X size={22} />
            </button>

            <div className="ticket-modal-header">
              <span className="section-kicker">CINEBOOK PRESENTS</span>

              <h2>
                Your Movie <span>Ticket</span>
              </h2>
              <p>Enjoy your show!</p>
            </div>

            <img
              className="digital-ticket-poster"
              src={viewingTicket.posterUrl}
              alt={viewingTicket.title}
            />

            <div className="digital-ticket-details">
              <h3>{viewingTicket.title}</h3>

              <p>
                <strong>Booking ID:</strong> {viewingTicket.bookingCode}
              </p>

              <p>
                <strong>Theatre:</strong> {viewingTicket.theatre}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {String(viewingTicket.showDate).slice(0, 10)}
              </p>

              <p>
                <strong>Time:</strong> {viewingTicket.showTime}
              </p>

              <p>
                <strong>Seats:</strong> {viewingTicket.seats}
              </p>

              <p>
                <strong>Amount:</strong> ₹
                {Number(viewingTicket.totalAmount).toFixed(0)}
              </p>

              <span className="status-pill">CONFIRMED</span>
            </div>

            <div className="digital-ticket-qr">
              <QRCodeSVG
                value={`CINEBOOK:${viewingTicket.bookingCode}`}
                size={150}
                bgColor="#ffffff"
                fgColor="#0d1729"
                level="H"
              />
              <p>Scan your ticket code</p>
            </div>

            <button
              className="btn btn-primary ticket-print-btn"
              onClick={() => window.print()}
            >
              Print / Download Ticket
            </button>

            <div className="ticket-modal-footer">
              <span>Thank you for booking with CineBook</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

function ToastContainer() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const showToast = (event) => {
      setToast({
        message: event.detail.message,
        type: event.detail.type || "success",
      });

      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setToast(null), 3500);
    };

    window.addEventListener("cinebook:toast", showToast);

    return () => {
      window.removeEventListener("cinebook:toast", showToast);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className={`toast-notification toast-${toast.type}`}>
      <span className="toast-icon">
        {toast.type === "success" ? <Check size={19} /> : <X size={19} />}
      </span>

      <div className="toast-content">
        <strong>
          {toast.type === "success" ? "Success" : "Something went wrong"}
        </strong>
        <p>{toast.message}</p>
      </div>

      <button
        className="toast-close"
        onClick={() => setToast(null)}
        aria-label="Close notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function notify(message, type = "success") {
  window.dispatchEvent(
    new CustomEvent("cinebook:toast", {
      detail: { message, type },
    }),
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Ticket size={20} />
          </span>
          <span>
            Cine<span>Book</span>
          </span>
        </Link>
        <p>Good stories. Great company. Unforgettable nights.</p>
        <div className="footer-links">
          <Link to="/movies">Movies</Link>
          <Link to="/my-bookings">My bookings</Link>
          <a href="mailto:hello@cinebook.example">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} CineBook. Made for movie lovers.
        </span>
        <span>
          All seats lead to a story <Heart size={13} fill="currentColor" />
        </span>
      </div>
    </footer>
  );
}

function ExperiencePage() {
  return (
    <main className="experience-page">
      {/* HERO */}
      <section className="experience-hero">
        <div className="experience-hero-content">
          <span className="section-kicker">THE CINEBOOK EXPERIENCE</span>

          <h1>
            Movies are better
            <br />
            <span>when the experience is unforgettable.</span>
          </h1>

          <p>
            From choosing your favourite movie to finding the perfect seat, make
            every movie night special with CineBook.
          </p>

          <NavLink to="/movies" className="btn btn-primary">
            Explore Movies →
          </NavLink>
        </div>

        <div className="experience-hero-art">
          <div className="experience-screen">
            <span>YOUR NEXT SCENE</span>
            <strong>BEGINS HERE.</strong>
            <span className="screen-glow">CINEBOOK</span>
          </div>
        </div>
      </section>

      {/* SEAT SELECTION */}
      <section className="experience-feature">
        <div className="experience-feature-visual seat-visual">
          <div className="seat-demo">
            {["A", "B", "C", "D"].map((row) => (
              <div className="seat-row" key={row}>
                <span>{row}</span>
                {[1, 2, 3, 4, 5, 6].map((seat) => (
                  <div
                    key={seat}
                    className={`seat-box ${
                      row === "B" && (seat === 3 || seat === 4)
                        ? "seat-selected"
                        : seat === 6
                          ? "seat-booked"
                          : ""
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <span>Available</span>
            <span>Selected</span>
            <span>Booked</span>
          </div>
        </div>

        <div className="experience-feature-copy">
          <span className="section-kicker">YOUR SEAT, YOUR CHOICE</span>
          <h2>Find your perfect seat.</h2>
          <p>
            Choose the seats you love, check availability and plan your movie
            outing together. Your perfect view is just a few clicks away.
          </p>
        </div>
      </section>

      {/* FORMATS */}
      <section className="experience-formats">
        <div className="experience-section-heading">
          <span className="section-kicker">CHOOSE YOUR VIEW</span>
          <h2>Experience movies your way.</h2>
          <p>Different formats. One unforgettable experience.</p>
        </div>

        <div className="experience-format-grid">
          <div className="experience-format-card">
            <span className="format-number">01</span>
            <h3>2D</h3>
            <p>Enjoy every story in classic cinematic quality.</p>
          </div>

          <div className="experience-format-card featured-format">
            <span className="format-number">02</span>
            <h3>3D</h3>
            <p>Step closer to the action with an immersive view.</p>
          </div>

          <div className="experience-format-card">
            <span className="format-number">03</span>
            <h3>IMAX</h3>
            <p>Go bigger with a larger-than-life movie experience.</p>
          </div>
        </div>
      </section>

      {/* MOVIE NIGHT */}
      <section className="experience-feature movie-night-feature">
        <div className="experience-feature-copy">
          <span className="section-kicker">MAKE IT A NIGHT</span>
          <h2>More than just watching a movie.</h2>
          <p>
            Discover cinemas across different cities, explore show timings and
            turn an ordinary evening into a memorable movie night.
          </p>
          <NavLink to="/movies" className="btn btn-outline">
            Find Your Cinema →
          </NavLink>
        </div>

        <div className="movie-night-visual">
          <div className="movie-night-circle">✦</div>
          <span>LIGHTS DOWN.</span>
          <strong>STORY ON.</strong>
          <span className="movie-night-small">MAKE EVERY MOMENT COUNT</span>
        </div>
      </section>

      {/* BOOKING STEPS */}
      <section className="experience-booking">
        <div className="experience-section-heading">
          <span className="section-kicker">SIMPLE FROM START TO FINISH</span>
          <h2>Your movie night in 5 easy steps.</h2>
        </div>

        <div className="experience-steps">
          {[
            [
              "01",
              "Choose a movie",
              "Explore movies and find your next favourite.",
            ],
            ["02", "Select a cinema", "Choose your preferred city and cinema."],
            [
              "03",
              "Pick a show",
              "Find a date and showtime that works for you.",
            ],
            [
              "04",
              "Select your seats",
              "Choose available seats for your group.",
            ],
            [
              "05",
              "Confirm booking",
              "Review your details and confirm your booking.",
            ],
          ].map(([number, title, description]) => (
            <div className="experience-step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>

        <div className="experience-final-cta">
          <span className="section-kicker">READY FOR YOUR NEXT MOVIE?</span>
          <h2>Your next scene starts with CineBook.</h2>
          <NavLink to="/movies" className="btn btn-primary">
            Book Your Movie →
          </NavLink>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Delhi");

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cinebook_user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    api("/movies")
      .then((data) => {
        if (Array.isArray(data)) {
          setMovies(data);
        }
      })
      .catch((e) => setApiError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api("/theatres/cities")
      .then((data) => {
        if (Array.isArray(data)) {
          setCities(data);

          setSelectedCity((current) =>
            data.includes(current) ? current : data[0] || "",
          );
        }
      })
      .catch((error) => {
        console.error("Could not load cities:", error);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("cinebook_token");
    localStorage.removeItem("cinebook_user");
    setUser(null);
    notify("You have been signed out!");
  };

  const handleAuth = (nextUser) => {
    localStorage.setItem("cinebook_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  return (
    <div className="app-shell">
      <Header
        user={user}
        onLogout={logout}
        cities={cities}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />
      <ToastContainer />

      <Routes>
        <Route
          path="/"
          element={<Home movies={movies} loading={loading} error={apiError} />}
        />

        <Route path="/movies" element={<MoviesPage movies={movies} />} />

        <Route path="/experience" element={<ExperiencePage />} />

        <Route
          path="/movies/:id"
          element={
            <MovieDetails
              movies={movies}
              user={user}
              selectedCity={selectedCity}
            />
          }
        />
        <Route
          path="/book/:id"
          element={<BookingPage movies={movies} user={user} />}
        />
        <Route
          path="/login"
          element={<AuthPage key="login" mode="login" onAuth={handleAuth} />}
        />
        <Route
          path="/register"
          element={
            <AuthPage key="register" mode="register" onAuth={handleAuth} />
          }
        />
        <Route path="/my-bookings" element={<MyBookings user={user} />} />
        <Route
          path="/admin/login"
          element={<AdminLogin onAuth={handleAuth} />}
        />
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard user={user} onLogout={logout} />
            ) : (
              <main className="inner-page">
                {" "}
                <div className="empty-state">
                  {" "}
                  <ShieldCheck size={34} /> <h3>Admin access required </h3>{" "}
                  <p> Please sign in with an administrator account.</p>{" "}
                  <Link className="btn btn-primary" to="/admin/login">
                    {" "}
                    Admin sign in
                  </Link>{" "}
                </div>{" "}
              </main>
            )
          }
        />
        <Route
          path="*"
          element={
            <main className="inner-page">
              <div className="empty-state">
                <Film size={32} />
                <h3>Page not found</h3>
                <Link className="btn btn-primary" to="/">
                  Go home
                </Link>
              </div>
            </main>
          }
        />
      </Routes>
    </div>
  );
}
