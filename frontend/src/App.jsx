import { useEffect, useMemo, useState } from "react";
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

function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <a href="/#experience" onClick={() => setMenuOpen(false)}>
            Experience
          </a>
          <NavLink to="/my-bookings" onClick={() => setMenuOpen(false)}>
            My Bookings
          </NavLink>
          <NavLink to="/admin/login" className="nav-link">
            Admin Portal
          </NavLink>
        </nav>

        <div className="header-actions">
          <span className="location-chip">
            <MapPin size={15} /> Delhi NCR <ChevronDown size={14} />
          </span>
          {user ? (
            <button className="user-chip" onClick={onLogout}>
              <UserRound size={16} /> {user.name.split(" ")[0]}{" "}
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
    <main className="inner-page">
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

function MovieDetails({ movies, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => String(m.id) === id);

  const [date, setDate] = useState("");
  const [shows, setShows] = useState([]);
  const [showsLoading, setShowsLoading] = useState(false);
  const [showsError, setShowsError] = useState("");
  const [theatreId, setTheatreId] = useState("");
  const [selectedShowId, setSelectedShowId] = useState("");

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

  // Only show dates which have scheduled shows
  const availableDates = [
    ...new Set(
      shows
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

  // Shows for selected date
  const dateShows = shows.filter(
    (show) =>
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

              {showsLoading ? (
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

              <select
                className="field-input"
                value={theatreId}
                disabled={!dateShows.length}
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

              {showsLoading ? (
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const showId = Number(saved.showId);
  useEffect(() => {
    if (!showId) {
      setSeatsLoading(false);
      return;
    }

    setSeatsLoading(true);

    api(`/bookings/show/${showId}/seats`)
      .then((data) => {
        setBusySeats(data.bookedSeats || []);
      })
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
    setSuccess("");

    if (!user) {
      return navigate("/login", {
        state: { from: `/book/${id}`, ...saved },
      });
    }

    if (!showId || !Number.isFinite(showId)) {
      return setError(
        "Show information is missing. Please go back and select a show again.",
      );
    }

    if (!selected.length) {
      return setError("Choose at least one seat to continue.");
    }

    setSubmitting(true);

    try {
      const result = await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          showId,
          seats: selected,
        }),
      });

      setSuccess(
        `Booking confirmed! Your booking code is ${result.bookingCode}.`,
      );
      setSelected([]);
      setBusySeats((old) => [...old, ...selected]);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
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
          Pick your <span>perfect seat.</span>
        </h1>
        <p>
          {movie.title} · {date} · {time}
        </p>
      </div>

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
            ₹{price} per seat · No payment is collected in this demo.
          </p>

          {error && <div className="notice notice-error">{error}</div>}

          {success && (
            <div className="notice notice-success">
              <Check size={16} /> {success}
              <br />
              <Link to="/my-bookings">View my bookings →</Link>
            </div>
          )}

          <button
            className="btn btn-primary btn-wide"
            onClick={confirm}
            disabled={submitting}
          >
            {submitting ? "Confirming…" : "Confirm booking"}
            <ArrowRight size={17} />
          </button>
        </aside>
      </div>

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
      navigate(location.from || "/", { state: location, replace: true });
    } catch (err) {
      setError(err.message);
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
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
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
  const [shows, setShows] = useState([]);
  const [showOptions, setShowOptions] = useState({ movies: [], screens: [] });

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
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadMovies = async () => {
    try {
      const data = await api("/movies");
      setMovies(data);
    } catch (err) {
      setError(err.message || "Could not load movies.");
    } finally {
      setLoading(false);
    }
  };

  const loadShowOptions = async () => {
    try {
      const data = await api("/shows/options");
      setShowOptions(data);
    } catch (err) {
      setError(err.message || "Could not load movies and screens.");
    }
  };

  useEffect(() => {
    loadMovies();
    loadShowOptions();
  }, []);

  const loadShows = async (date = showDate) => {
    setError("");
    setShowsLoading(true);

    try {
      const data = await api(`/shows?date=${date}`);
      setShows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load shows.");
    } finally {
      setShowsLoading(false);
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setCreatingShow(true);

    try {
      await api("/shows", {
        method: "POST",
        body: JSON.stringify({
          movieId: Number(showForm.movieId),
          screenId: Number(showForm.screenId),
          startsAt: `${showForm.date} ${showForm.time}:00`,
          price: Number(showForm.price),
          format: showForm.format,
        }),
      });

      setMessage("Show created successfully!");
      setShowDate(showForm.date);
      await loadShows(showForm.date);
    } catch (err) {
      setError(err.message || "Could not create show.");
    } finally {
      setCreatingShow(false);
    }
  };

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
      } else {
        await api("/movies", {
          method: "POST",
          body: JSON.stringify(getPayload()),
        });
        setMessage("Movie added successfully!");
      }

      resetForm();
      await loadMovies();
      await loadShowOptions();
    } catch (err) {
      setError(err.message || "Could not save movie.");
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
      await loadMovies();
      await loadShowOptions();
    } catch (err) {
      setError(
        err.message ||
          "Could not delete movie. It may be linked to existing shows or bookings.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="inner-page">
      <div className="page-heading">
        <div className="section-kicker">CINEBOOK ADMIN PANEL</div>
        <h1>
          Welcome, <span>{user.name}.</span>
        </h1>
        <p>Manage your CineBook movies and showtimes.</p>
      </div>

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
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  minWidth: 0,
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

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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

          <label className="field-label">Select Theatre Screen *</label>
          <select
            className="field-input"
            value={showForm.screenId}
            onChange={(e) =>
              setShowForm({ ...showForm, screenId: e.target.value })
            }
            required
          >
            <option value="">Choose Screen</option>
            {showOptions.screens.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.theatreName} - {screen.name}
              </option>
            ))}
          </select>

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

          <button
            className="btn btn-primary btn-wide"
            disabled={creatingShow}
            style={{ marginTop: 15 }}
          >
            {creatingShow ? "Creating Show..." : "Create Show"}
            {error && <div className="notice notice-error">{error}</div>}
            {message && <div className="notice notice-success">{message}</div>}
          </button>
        </form>

        <hr style={{ margin: "25px 0", borderColor: "#29354b" }} />

        <h3>View Scheduled Shows</h3>
        <label className="field-label">Select Date</label>
        <input
          className="field-input"
          type="date"
          value={showDate}
          onChange={(e) => setShowDate(e.target.value)}
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

        {shows.length === 0 && (
          <p style={{ marginTop: 15 }}>No shows found for this date.</p>
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
        setViewingTicket((old) => ({
          ...old,
          status: "CANCELLED",
        }));
      }

      setMessage(result.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setCancelling(null);
    }
  };

  if (!user) {
    return (
      <main className="inner-page">
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

                <button
                  className="btn btn-primary"
                  onClick={() => setViewingTicket(b)}
                >
                  View Ticket
                </button>

                {b.status === "CONFIRMED" && (
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

      {viewingTicket && (
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

              <span className="status-pill">{viewingTicket.status}</span>
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

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

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

  const logout = () => {
    localStorage.removeItem("cinebook_token");
    localStorage.removeItem("cinebook_user");
    setUser(null);
  };

  const handleAuth = (nextUser) => {
    localStorage.setItem("cinebook_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  return (
    <div className="app-shell">
      <Header user={user} onLogout={logout} />

      <Routes>
        <Route
          path="/"
          element={<Home movies={movies} loading={loading} error={apiError} />}
        />
        <Route path="/movies" element={<MoviesPage movies={movies} />} />
        <Route
          path="/movies/:id"
          element={<MovieDetails movies={movies} user={user} />}
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
