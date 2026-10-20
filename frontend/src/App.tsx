import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Search,
  MapPin,
  ChevronDown,
  Play,
  Ticket,
  Star,
  Clock3,
  CalendarDays,
  ArrowRight,
  SlidersHorizontal,
  Plus,
  Minus,
  Check,
  X,
  Film,
  Armchair,
  CreditCard,
  ShieldCheck,
  UserRound,
  Clapperboard,
  LayoutDashboard,
  LogOut,
  Menu,
  Heart,
  Sparkles,
  ArrowLeft,
  Trash2,
  Pencil,
  Eye,
  CircleHelp,
} from "lucide-react";

type Movie = {
  id: string;
  title: string;
  genre: string;
  language: string;
  duration: string;
  rating: string;
  year: number;
  certificate: string;
  poster: string;
  backdrop: string;
  synopsis: string;
  cast: string[];
  director: string;
  price: number;
  status: "Now Showing" | "Coming Soon";
  featured?: boolean;
};
type Booking = {
  id: string;
  movieId: string;
  movieTitle: string;
  poster: string;
  theatre: string;
  date: string;
  time: string;
  seats: string[];
  amount: number;
  status: string;
  customer: string;
};
let movies: Movie[] = [
  {
    id: "midnight",
    title: "Midnight in Mumbai",
    genre: "Thriller",
    language: "Hindi",
    duration: "2h 14m",
    rating: "8.7",
    year: 2026,
    certificate: "UA 16+",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    synopsis:
      "One city. One night. A missing journalist and a secret that could change everything. As Mumbai sleeps, an ordinary cab ride becomes a race against time.",
    cast: ["Aarav Mehta", "Mira Kapoor", "Kabir Sethi"],
    director: "R. Malhotra",
    price: 280,
    status: "Now Showing",
    featured: true,
  },
  {
    id: "interstellar",
    title: "Interstellar: Beyond",
    genre: "Sci-Fi",
    language: "English",
    duration: "2h 49m",
    rating: "9.1",
    year: 2026,
    certificate: "UA 13+",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    synopsis:
      "Beyond the edge of the known universe, one crew searches for a future humanity can call home. Time, distance and sacrifice take on a whole new meaning.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    director: "Christopher Nolan",
    price: 320,
    status: "Now Showing",
    featured: true,
  },
  {
    id: "safar",
    title: "Safar",
    genre: "Drama",
    language: "Hindi",
    duration: "2h 06m",
    rating: "8.4",
    year: 2026,
    certificate: "U/A",
    poster: "https://image.tmdb.org/t/p/w500/5qGIxdEO841C0tdY8vOdLoRVrr0.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/5qGIxdEO841C0tdY8vOdLoRVrr0.jpg",
    synopsis:
      "A heartfelt journey across the country brings three strangers together, reminding them that sometimes the destination matters less than the people we meet on the way.",
    cast: ["Ananya Rao", "Vikram Joshi", "Dev Arora"],
    director: "N. Sharma",
    price: 240,
    status: "Now Showing",
  },
  {
    id: "dune",
    title: "Dune: Part Two",
    genre: "Adventure",
    language: "English",
    duration: "2h 46m",
    rating: "8.8",
    year: 2026,
    certificate: "UA 13+",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    synopsis:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    director: "Denis Villeneuve",
    price: 300,
    status: "Now Showing",
  },
  {
    id: "neon",
    title: "Neon Dreams",
    genre: "Romance",
    language: "English",
    duration: "1h 58m",
    rating: "7.9",
    year: 2026,
    certificate: "UA 13+",
    poster: "https://image.tmdb.org/t/p/w500/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg",
    synopsis:
      "Two musicians meet by chance in a city that never sleeps and discover that the hardest song to write is the one that tells the truth.",
    cast: ["Lena Hart", "Noah Ellis", "Maya Chen"],
    director: "Sofia Reed",
    price: 260,
    status: "Now Showing",
  },
  {
    id: "wild",
    title: "Into the Wild Blue",
    genre: "Adventure",
    language: "English",
    duration: "2h 02m",
    rating: "8.2",
    year: 2026,
    certificate: "U",
    poster: "https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CxJ8p.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/2CAL2433ZeIihfX1Hb2139CxJ8p.jpg",
    synopsis:
      "A young explorer follows a mysterious map into untouched wilderness and learns what courage really means.",
    cast: ["Olivia Stone", "Ethan Cole", "Ravi Shah"],
    director: "Amelia Brooks",
    price: 250,
    status: "Coming Soon",
  },
  {
    id: "orbit",
    title: "Orbit 9",
    genre: "Sci-Fi",
    language: "Hindi",
    duration: "2h 20m",
    rating: "—",
    year: 2026,
    certificate: "UA 13+",
    poster: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    synopsis:
      "When a deep-space signal reaches Earth, a young engineer must decide whether humanity is ready to answer.",
    cast: ["Ishaan Verma", "Tara Sen", "Manav Gill"],
    director: "A. Khanna",
    price: 290,
    status: "Coming Soon",
  },
];
const theatres = [
  {
    id: "pvr",
    name: "PVR Select Citywalk",
    area: "Saket, New Delhi",
    distance: "4.2 km",
    formats: ["IMAX", "4K", "Dolby Atmos"],
    times: ["10:15 AM", "1:30 PM", "4:45 PM", "8:20 PM"],
  },
  {
    id: "inox",
    name: "INOX Insignia",
    area: "Vasant Kunj, New Delhi",
    distance: "7.8 km",
    formats: ["Laser", "Recliner", "Dolby Atmos"],
    times: ["11:00 AM", "2:10 PM", "6:00 PM", "9:15 PM"],
  },
  {
    id: "cinepolis",
    name: "Cinépolis DLF Avenue",
    area: "Saket, New Delhi",
    distance: "4.8 km",
    formats: ["4K", "Dolby Atmos"],
    times: ["9:45 AM", "12:50 PM", "5:10 PM", "7:55 PM"],
  },
];
const genres = [
  "All Movies",
  "Action",
  "Adventure",
  "Drama",
  "Romance",
  "Sci-Fi",
  "Thriller",
];
const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const getBookings = (): Booking[] => {
  try {
    return JSON.parse(localStorage.getItem("cinebook-bookings") || "[]");
  } catch {
    return [];
  }
};
const saveBookings = (b: Booking[]) =>
  localStorage.setItem("cinebook-bookings", JSON.stringify(b));
function App() {
  const [user, setUser] = useState<string | null>(() =>
    localStorage.getItem("cinebook-user"),
  );
  const [city, setCity] = useState("New Delhi");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(getBookings);
  const [toast, setToast] = useState("");
  const notify = (s: string) => {
    setToast(s);
    window.setTimeout(() => setToast(""), 2800);
  };
  const login = (name: string) => {
    localStorage.setItem("cinebook-user", name);
    setUser(name);
    notify(`Welcome, ${name}!`);
  };
  const logout = () => {
    localStorage.removeItem("cinebook-user");
    setUser(null);
    notify("You have been signed out.");
  };
  const addBooking = (b: Booking) => {
    const next = [b, ...getBookings()];
    saveBookings(next);
    setBookings(next);
  };
  const [, setMoviesVersion] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch movies");
        return res.json();
      })
      .then((result) => {
        if (!Array.isArray(result.data) || result.data.length === 0) {
          return;
        }

        movies = result.data.map((m: any) => {
          let cast: string[] = [];

          try {
            cast = Array.isArray(m.cast_json)
              ? m.cast_json
              : JSON.parse(m.cast_json || "[]");
          } catch {
            cast = [];
          }

          const poster =
            m.poster_url ||
            "https://placehold.co/500x750/17171e/ffffff?text=CineBook";

          const minutes = Number(m.duration_minutes) || 120;

          return {
            id: String(m.id),
            title: m.title,
            genre: m.genre || "Drama",
            language: m.language || "Hindi",
            duration: `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`,
            rating: m.rating == null ? "—" : String(m.rating),
            year: Number(String(m.release_year).slice(0, 4)) || 2026,
            certificate: m.certificate || "U/A",
            poster,
            backdrop: m.backdrop_url || poster,
            synopsis: m.synopsis || "Movie details coming soon.",
            cast,
            director: m.director || "TBA",
            price: Number(m.base_price) || 200,
            status:
              m.status === "Coming Soon"
                ? ("Coming Soon" as const)
                : ("Now Showing" as const),
          };
        });

        setMoviesVersion((v) => v + 1);
      })
      .catch((error) => {
        console.error("Failed to load movies:", error);
      });
  }, []);
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <Clapperboard size={20} />
            </span>
            <span>
              Cine<span className="brand-red">Book</span>
              <small>YOUR NEXT SCENE</small>
            </span>
          </Link>
          <nav className={mobileOpen ? "nav-links open" : "nav-links"}>
            <NavLink to="/movies">Movies</NavLink>
            <a href="/#theatres">Theatres</a>
            <NavLink to="/my-bookings">My Bookings</NavLink>
            <NavLink to="/admin" className="admin-nav">
              Admin
            </NavLink>
          </nav>
          <div className="nav-actions">
            <button
              className="city-button"
              onClick={() =>
                setCity(city === "New Delhi" ? "Gurugram" : "New Delhi")
              }
            >
              <MapPin size={15} />
              <span>{city}</span>
              <ChevronDown size={14} />
            </button>
            {user ? (
              <button className="user-pill" onClick={logout}>
                <UserRound size={15} />
                {user.split(" ")[0]}
                <LogOut size={14} />
              </button>
            ) : (
              <Link className="sign-in" to="/login">
                <UserRound size={16} /> Sign in
              </Link>
            )}
            <button
              className="mobile-menu"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home city={city} />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetails city={city} />} />
          <Route path="/shows/:id" element={<ShowSelection city={city} />} />
          <Route
            path="/seats/:id"
            element={<SeatSelection user={user} notify={notify} />}
          />
          <Route
            path="/payment"
            element={
              <Payment user={user} notify={notify} addBooking={addBooking} />
            }
          />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route
            path="/my-bookings"
            element={<MyBookings bookings={bookings} user={user} />}
          />
          <Route path="/admin" element={<Admin notify={notify} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}
function Home({ city }: { city: string }) {
  const [query, setQuery] = useState("");
  const featured = movies.find(m => m.featured) ?? movies[0];
  const now = movies.filter((m) => m.status === "Now Showing");
  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, #09090d 0%, rgba(9,9,13,.96) 24%, rgba(9,9,13,.55) 58%, rgba(9,9,13,.2) 100%), linear-gradient(0deg,#09090d 0%,transparent 50%), url(${featured.backdrop || movies[0]?.backdrop || ""})`,
        }}
      >
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot" /> THE BIG SCREEN IS CALLING
          </div>
          <div className="hero-kicker">
            <Sparkles size={15} /> CINEBOOK ORIGINAL PICK
          </div>
          <h1>
            Every story
            <br />
            deserves <em>the big screen.</em>
          </h1>
          <p className="hero-copy">
            Find your next favourite. Book your seats. Make it a movie night to
            remember.
          </p>
          <div className="hero-meta">
            <span>
              <Star size={15} fill="currentColor" /> {featured.rating}/10
            </span>
            <span>{featured.year}</span>
            <span>{featured.duration}</span>
            <span className="cert">{featured.certificate}</span>
          </div>
          <div className="hero-buttons">
            <Link to={`/movie/${featured.id}`} className="btn btn-primary">
              <Ticket size={17} /> Book tickets <ArrowRight size={16} />
            </Link>
            <Link to={`/movie/${movies[1]?.id || ""}`} className="btn btn-glass">
              <Play size={16} /> Explore movies
            </Link>
          </div>
          <div className="hero-footnote">
            <ShieldCheck size={15} /> Easy booking. Great seats. Zero drama.
          </div>
        </div>
        <div className="hero-side-note">
          <span>01</span>
          <i /> FEATURED THIS WEEK
        </div>
      </section>
      <section className="search-strip">
        <form
          className="search-box"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `/movies?q=${encodeURIComponent(query)}`;
          }}
        >
          <Search size={19} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, genres, languages..."
          />
          <span className="search-hint">PRESS ENTER ↵</span>
          <button aria-label="Search">
            <ArrowRight size={18} />
          </button>
        </form>
        <div className="quick-categories">
          <span>QUICK PICKS</span>
          {["Action", "Comedy", "Thriller", "Sci-Fi"].map((g) => (
            <Link key={g} to={`/movies?genre=${g}`}>
              {g}
            </Link>
          ))}
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <div className="section-kicker">
              CURATED FOR YOUR NEXT NIGHT OUT
            </div>
            <h2>
              Now <em>showing</em>
            </h2>
            <p className="section-sub">The films everyone's talking about.</p>
          </div>
          <Link className="text-link" to="/movies">
            View all movies <ArrowRight size={16} />
          </Link>
        </div>
        <div className="movie-grid">
          {now.slice(0, 5).map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} />
          ))}
        </div>
      </section>
      <section className="feature-banner wrap">
        <div className="feature-icon">
          <Armchair size={25} />
        </div>
        <div>
          <span className="section-kicker">YOUR SEAT. YOUR MOMENT.</span>
          <h3>
            Great movies. <em>Even better seats.</em>
          </h3>
          <p>Pick your perfect spot before someone else does.</p>
        </div>
        <Link className="btn btn-primary" to={`/shows/${featured.id}`}>
          Find your seats <ArrowRight size={16} />
        </Link>
      </section>
      <section className="section wrap" id="theatres">
        <div className="section-heading">
          <div>
            <div className="section-kicker">CLOSE TO YOU</div>
            <h2>
              Find your <em>theatre</em>
            </h2>
            <p className="section-sub">
              Showing near {city} — switch your city from the top.
            </p>
          </div>
        </div>
        <div className="theatre-grid">
          {theatres.map((t, i) => (
            <div className="theatre-card" key={t.id}>
              <div className="theatre-icon">
                <Film size={22} />
              </div>
              <div className="theatre-number">0{i + 1}</div>
              <h3>{t.name}</h3>
              <p>
                <MapPin size={14} />
                {t.area}
              </p>
              <div className="format-tags">
                {t.formats.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
              <div className="theatre-bottom">
                <span>{t.distance} away</span>
                <Link to={`/shows/${featured.id}`}>
                  View shows <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="coming-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <div className="section-kicker">SAVE THE DATE</div>
              <h2>
                Coming <em>soon</em>
              </h2>
              <p className="section-sub">
                Your watchlist is about to get longer.
              </p>
            </div>
            <Link className="text-link" to="/movies">
              Explore all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="coming-grid">
            {movies
              .filter((m) => m.status === "Coming Soon")
              .map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
  return (
    <article
      className="movie-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link to={`/movie/${movie.id}`} className="poster-wrap">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/500x750/17171e/ffffff?text=CineBook";
          }}
        />
        <span className="poster-badge">
          {movie.status === "Now Showing" ? "NOW SHOWING" : "COMING SOON"}
        </span>
        <span className="poster-overlay">
          <span className="poster-cta">
            <Ticket size={15} /> View details
          </span>
        </span>
      </Link>
      <div className="movie-info">
        <div className="movie-title-line">
          <Link to={`/movie/${movie.id}`} className="movie-title">
            {movie.title}
          </Link>
          <span className="rating">
            <Star size={12} fill="currentColor" />
            {movie.rating}
          </span>
        </div>
        <div className="movie-subtitle">
          {movie.genre} <span>·</span> {movie.language} <span>·</span>{" "}
          {movie.duration}
        </div>
        <div className="movie-card-bottom">
          <span className="price-from">
            From <b>{money(movie.price)}</b>
          </span>
          <Link
            to={`/shows/${movie.id}`}
            className="round-arrow"
            aria-label={`Book ${movie.title}`}
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
function MoviesPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [genre, setGenre] = useState(params.get("genre") || "All Movies");
  const [language, setLanguage] = useState("All Languages");
  const [status, setStatus] = useState("All");
  const filtered = useMemo(
    () =>
      movies.filter(
        (m) =>
          (m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.genre.toLowerCase().includes(query.toLowerCase())) &&
          (genre === "All Movies" || m.genre === genre) &&
          (language === "All Languages" || m.language === language) &&
          (status === "All" || m.status === status),
      ),
    [query, genre, language, status],
  );
  return (
    <div className="page-wrap wrap">
      <div className="page-title-row">
        <div>
          <div className="section-kicker">THE CINEBOOK COLLECTION</div>
          <h1>
            Find your next <em>favourite.</em>
          </h1>
          <p>Stories worth stepping out for.</p>
        </div>
        <div className="catalog-count">
          <b>{filtered.length.toString().padStart(2, "0")}</b>
          <span>FILMS TO EXPLORE</span>
        </div>
      </div>
      <div className="filter-bar">
        <label className="filter-search">
          <Search size={17} />
          <input
            placeholder="Search by title or genre"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="select-wrap">
          <SlidersHorizontal size={15} />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {genres.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="select-wrap">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>All Languages</option>
            <option>Hindi</option>
            <option>English</option>
          </select>
        </label>
        <label className="select-wrap">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All releases</option>
            <option>Now Showing</option>
            <option>Coming Soon</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="movie-grid catalog-grid">
          {filtered.map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No movies found"
          text="Try another title or change your filters."
          action={
            <button
              className="btn btn-glass"
              onClick={() => {
                setQuery("");
                setGenre("All Movies");
                setLanguage("All Languages");
                setStatus("All");
              }}
            >
              Clear filters
            </button>
          }
        />
      )}
    </div>
  );
}
function MovieDetails({ city }: { city: string }) {
  const { id = "" } = useParams();
  const m = movies.find((x) => x.id === id);
  if (!m) return <NotFound />;
  return (
    <div
      className="details-page"
      style={{
        backgroundImage: `linear-gradient(90deg,#09090d 0%,rgba(9,9,13,.96) 35%,rgba(9,9,13,.55) 100%),linear-gradient(0deg,#09090d,transparent 65%),url(${m.backdrop})`,
      }}
    >
      <div className="wrap details-layout">
        <img
          className="details-poster"
          src={m.poster}
          alt={m.title}
          onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/500x750/17171e/ffffff?text=CineBook")
          }
        />
        <div className="details-copy">
          <Link to="/movies" className="back-link">
            <ArrowLeft size={15} /> Back to movies
          </Link>
          <div className="eyebrow">
            <span className="live-dot" />
            {m.status.toUpperCase()}
          </div>
          <h1>{m.title}</h1>
          <div className="detail-meta">
            <span className="rating large">
              <Star size={15} fill="currentColor" />
              {m.rating}/10
            </span>
            <span>{m.year}</span>
            <span>{m.duration}</span>
            <span className="cert">{m.certificate}</span>
          </div>
          <div className="detail-tags">
            <span>{m.genre}</span>
            <span>{m.language}</span>
            <span>4K available</span>
          </div>
          <p className="synopsis">{m.synopsis}</p>
          <div className="cast-block">
            <span>DIRECTED BY</span>
            <b>{m.director}</b>
            <span>CAST</span>
            <b>{m.cast.join("  ·  ")}</b>
          </div>
          <div className="detail-price">
            Tickets from <strong>{money(m.price)}</strong>
          </div>
          <Link to={`/shows/${m.id}`} className="btn btn-primary detail-book">
            <Ticket size={18} /> Book tickets <ArrowRight size={17} />
          </Link>
          <div className="secure-note">
            <ShieldCheck size={14} /> Secure checkout <span>·</span> Instant
            confirmation <span>·</span> {city}
          </div>
        </div>
      </div>
    </div>
  );
}
function ShowSelection({ city }: { city: string }) {
  const { id = "" } = useParams();
  const m = movies.find((x) => x.id === id);
  const [day, setDay] = useState(0);
  if (!m) return <NotFound />;
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  return (
    <div className="page-wrap wrap">
      <div className="booking-steps">
        <span className="step done">
          <Check size={13} /> Movie
        </span>
        <i />
        <span className="step active">
          02 <span>Showtime</span>
        </span>
        <i />
        <span className="step">
          03 <span>Seats</span>
        </span>
        <i />
        <span className="step">
          04 <span>Payment</span>
        </span>
      </div>
      <div className="show-header">
        <div className="show-movie-mini">
          <img src={m.poster} alt="" />
          <div>
            <div className="section-kicker">YOU'RE BOOKING</div>
            <h1>{m.title}</h1>
            <p>
              {m.duration} <span>·</span> {m.language} <span>·</span>{" "}
              {m.certificate}
            </p>
          </div>
        </div>
        <span className="city-chip">
          <MapPin size={14} />
          {city}
        </span>
      </div>
      <div className="date-picker-row">
        {dates.map((d, i) => (
          <button
            key={i}
            onClick={() => setDay(i)}
            className={`date-card ${day === i ? "selected" : ""}`}
          >
            <span>
              {i === 0
                ? "TODAY"
                : i === 1
                  ? "TOMORROW"
                  : d
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase()}
            </span>
            <b>{d.getDate()}</b>
            <small>
              {d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
            </small>
          </button>
        ))}
      </div>
      <div className="show-list-heading">
        <div>
          <h2>
            Choose your <em>showtime</em>
          </h2>
          <p>Pick a theatre and a time that works for you.</p>
        </div>
        <span>
          <span className="live-dot" /> {theatres.length} theatres
        </span>
      </div>
      <div className="show-theatres">
        {theatres.map((t, i) => (
          <article className="show-theatre-card" key={t.id}>
            <div className="show-theatre-main">
              <div className="theatre-icon">
                <Film size={21} />
              </div>
              <div>
                <h3>{t.name}</h3>
                <p>
                  <MapPin size={13} />
                  {t.area} <span>·</span> {t.distance}
                </p>
                <div className="format-tags">
                  {t.formats.map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="show-times">
              {t.times.map((time, j) => (
                <Link
                  key={time}
                  to={`/seats/${m.id}?theatre=${encodeURIComponent(t.name)}&date=${encodeURIComponent(dates[day].toISOString().slice(0, 10))}&time=${encodeURIComponent(time)}&price=${m.price + (j === 3 ? 40 : 0)}`}
                  className="time-slot"
                >
                  <b>{time}</b>
                  <small>{j === 3 ? "Recliner available" : "Available"}</small>
                </Link>
              ))}
            </div>
            <div className="show-theatre-foot">
              <span>
                <ShieldCheck size={13} /> Cancellation available on select shows
              </span>
              <span>{i === 0 ? "Top rated theatre" : "Great experience"}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
const rowLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
function SeatSelection({
  user,
  notify,
}: {
  user: string | null;
  notify: (s: string) => void;
}) {
  const { id = "" } = useParams();
  const m = movies.find((x) => x.id === id);
  const [params] = useSearchParams();
  const theatre = params.get("theatre") || theatres[0].name;
  const date = params.get("date") || new Date().toISOString().slice(0, 10);
  const time = params.get("time") || "7:30 PM";
  const price = Number(params.get("price") || m?.price || 250);
  const [selected, setSelected] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  if (!m) return <NotFound />;
  const booked = new Set([
    "A4",
    "A5",
    "B7",
    "B8",
    "C3",
    "C4",
    "D10",
    "E2",
    "E3",
    "F6",
    "F7",
    "G11",
    "H1",
    "H12",
  ]);
  const toggle = (seat: string) => {
    if (booked.has(seat)) return;
    setSelected((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : prev.length >= 8
          ? (notify("You can select up to 8 seats."), prev)
          : [...prev, seat],
    );
  };
  const proceed = () => {
    if (!selected.length) {
      notify("Please select at least one seat.");
      return;
    }
    sessionStorage.setItem(
      "cinebook-pending",
      JSON.stringify({
        movieId: m.id,
        movieTitle: m.title,
        poster: m.poster,
        theatre,
        date,
        time,
        seats: selected,
        amount: selected.length * price,
        customer: user || "",
      }),
    );
    if (!user) {
      setShowLogin(true);
      return;
    }
    navigate("/payment");
  };
  return (
    <div className="page-wrap wrap">
      <div className="booking-steps">
        <span className="step done">
          <Check size={13} /> Movie
        </span>
        <i />
        <span className="step done">
          <Check size={13} /> Showtime
        </span>
        <i />
        <span className="step active">
          03 <span>Seats</span>
        </span>
        <i />
        <span className="step">
          04 <span>Payment</span>
        </span>
      </div>
      <div className="seat-page-heading">
        <div>
          <div className="section-kicker">MAKE YOURSELF COMFORTABLE</div>
          <h1>
            Pick your <em>perfect seat.</em>
          </h1>
          <p>
            {theatre} <span>·</span>{" "}
            {new Date(date + "T12:00:00").toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            <span>·</span> {time}
          </p>
        </div>
        <Link className="back-link" to={`/shows/${m.id}`}>
          <ArrowLeft size={15} /> Change show
        </Link>
      </div>
      <div className="seat-layout-card">
        <div className="screen-wrap">
          <div className="screen-glow" />
          <div className="screen-shape" />
          <span>SCREEN THIS WAY</span>
        </div>
        <div className="seat-legend">
          <span>
            <i className="legend-seat available" /> Available
          </span>
          <span>
            <i className="legend-seat selected" /> Selected
          </span>
          <span>
            <i className="legend-seat booked" /> Occupied
          </span>
        </div>
        <div className="seat-map">
          {rowLetters.map((r, ri) => (
            <div className="seat-row" key={r}>
              <span className="row-label">{r}</span>
              <div className="seat-group">
                {Array.from({ length: 12 }, (_, si) => {
                  const seat = `${r}${si + 1}`;
                  const isBooked = booked.has(seat);
                  const isSelected = selected.includes(seat);
                  return (
                    <button
                      key={seat}
                      disabled={isBooked}
                      onClick={() => toggle(seat)}
                      className={`seat ${isBooked ? "booked" : isSelected ? "selected" : ""} ${si === 5 ? "aisle" : ""}`}
                      title={`${seat}${isBooked ? " · Occupied" : isSelected ? " · Selected" : " · Available"}`}
                    >
                      {isSelected ? <Check size={11} /> : si + 1}
                    </button>
                  );
                })}
              </div>
              <span className="row-label">{r}</span>
            </div>
          ))}
        </div>
        <div className="seat-layout-bottom">
          <span>
            <Armchair size={15} /> Standard · {money(price)} per seat
          </span>
          <span>Max. 8 seats per booking</span>
        </div>
      </div>
      <div className="seat-checkout">
        <div>
          <span className="section-kicker">YOUR SELECTION</span>
          <h3>
            {selected.length} {selected.length === 1 ? "seat" : "seats"}{" "}
            selected
          </h3>
          <div className="selected-seat-tags">
            {selected.length ? (
              selected.sort().map((s) => <span key={s}>{s}</span>)
            ) : (
              <small>Tap any available seat to get started.</small>
            )}
          </div>
        </div>
        <div className="seat-total">
          <span>Total amount</span>
          <b>{money(selected.length * price)}</b>
          <small>Inclusive of taxes (demo)</small>
        </div>
        <button
          className="btn btn-primary"
          onClick={proceed}
          disabled={!selected.length}
        >
          Continue to payment <ArrowRight size={16} />
        </button>
      </div>
      {showLogin && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setShowLogin(false)}>
              <X size={18} />
            </button>
            <div className="modal-icon">
              <UserRound />
            </div>
            <h2>One quick step.</h2>
            <p>Sign in to keep your seats and booking details together.</p>
            <Link
              to="/login"
              className="btn btn-primary"
              state={{ from: "/payment" }}
            >
              Continue to sign in <ArrowRight size={16} />
            </Link>
            <button
              className="text-link"
              onClick={() => {
                sessionStorage.setItem(
                  "cinebook-pending",
                  JSON.stringify({
                    movieId: m.id,
                    movieTitle: m.title,
                    poster: m.poster,
                    theatre,
                    date,
                    time,
                    seats: selected,
                    amount: selected.length * price,
                    customer: "",
                  }),
                );
                setShowLogin(false);
                navigate("/payment");
              }}
            >
              Continue as guest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function Payment({
  user,
  notify,
  addBooking,
}: {
  user: string | null;
  notify: (s: string) => void;
  addBooking: (b: Booking) => void;
}) {
  const [pending, setPending] = useState<any>(null);
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      setPending(
        JSON.parse(sessionStorage.getItem("cinebook-pending") || "null"),
      );
    } catch {
      setPending(null);
    }
  }, []);
  const pay = () => {
    if (!pending) {
      notify("No booking found. Please choose a movie first.");
      return;
    }
    setProcessing(true);
    window.setTimeout(() => {
      const booking: Booking = {
        id: "CB" + Date.now().toString().slice(-7),
        ...pending,
        customer: user || pending.customer || "Guest",
        status: "Confirmed",
      };
      addBooking(booking);
      sessionStorage.setItem("cinebook-last", JSON.stringify(booking));
      sessionStorage.removeItem("cinebook-pending");
      setProcessing(false);
      navigate(`/confirmation/${booking.id}`);
    }, 900);
  };
  if (!pending)
    return (
      <div className="page-wrap wrap">
        <EmptyState
          title="Nothing to checkout"
          text="Choose a movie and seats before continuing to payment."
          action={
            <Link className="btn btn-primary" to="/movies">
              Explore movies <ArrowRight size={16} />
            </Link>
          }
        />
      </div>
    );
  return (
    <div className="page-wrap wrap">
      <div className="booking-steps">
        <span className="step done">
          <Check size={13} /> Movie
        </span>
        <i />
        <span className="step done">
          <Check size={13} /> Showtime
        </span>
        <i />
        <span className="step done">
          <Check size={13} /> Seats
        </span>
        <i />
        <span className="step active">
          04 <span>Payment</span>
        </span>
      </div>
      <div className="payment-layout">
        <div className="payment-main">
          <div className="section-kicker">ALMOST MOVIE TIME</div>
          <h1>
            Confirm & <em>pay.</em>
          </h1>
          <p className="section-sub">
            This is a demo checkout. No real payment will be collected.
          </p>
          <div className="payment-methods">
            <button
              className={method === "upi" ? "payment-method active" : ""}
              onClick={() => setMethod("upi")}
            >
              <span className="method-icon">↗</span>
              <span>
                <b>UPI</b>
                <small>GPay, PhonePe, Paytm (simulated)</small>
              </span>
              {method === "upi" && <Check size={17} />}
            </button>
            <button
              className={method === "card" ? "payment-method active" : ""}
              onClick={() => setMethod("card")}
            >
              <span className="method-icon">
                <CreditCard size={20} />
              </span>
              <span>
                <b>Credit / Debit card</b>
                <small>Demo selection only — no card details</small>
              </span>
              {method === "card" && <Check size={17} />}
            </button>
            <button
              className={method === "later" ? "payment-method active" : ""}
              onClick={() => setMethod("later")}
            >
              <span className="method-icon">
                <CircleHelp size={20} />
              </span>
              <span>
                <b>Pay at theatre</b>
                <small>Demo option</small>
              </span>
              {method === "later" && <Check size={17} />}
            </button>
          </div>
          <div className="demo-notice">
            <ShieldCheck size={18} />
            <span>
              <b>Safe demo checkout</b>
              <small>
                Clicking “Confirm booking” creates a mock booking record in this
                browser only. No payment is processed.
              </small>
            </span>
          </div>
          <button
            className="btn btn-primary pay-button"
            onClick={pay}
            disabled={processing}
          >
            {processing ? "Confirming booking..." : "Confirm booking"}{" "}
            <ArrowRight size={17} />
          </button>
        </div>
        <aside className="order-summary">
          <div className="section-kicker">BOOKING SUMMARY</div>
          <div className="summary-movie">
            <img src={pending.poster} alt="" />
            <div>
              <b>{pending.movieTitle}</b>
              <small>{pending.theatre}</small>
              <small>
                {pending.date} · {pending.time}
              </small>
            </div>
          </div>
          <div className="summary-line">
            <span>Seats</span>
            <b>{pending.seats.join(", ")}</b>
          </div>
          <div className="summary-line">
            <span>Tickets ({pending.seats.length})</span>
            <b>{money(pending.amount)}</b>
          </div>
          <div className="summary-line">
            <span>Convenience fee</span>
            <b>Included</b>
          </div>
          <div className="summary-total">
            <span>Total payable</span>
            <b>{money(pending.amount)}</b>
          </div>
        </aside>
      </div>
    </div>
  );
}
function Confirmation() {
  const { id = "" } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  useEffect(() => {
    try {
      const b = JSON.parse(sessionStorage.getItem("cinebook-last") || "null");
      if (b?.id === id) setBooking(b);
      else setBooking(getBookings().find((x) => x.id === id) || null);
    } catch {
      setBooking(null);
    }
  }, [id]);
  if (!booking)
    return (
      <div className="page-wrap wrap">
        <EmptyState
          title="Ticket not found"
          text="Your demo ticket may have expired from this browser session."
          action={
            <Link className="btn btn-primary" to="/my-bookings">
              My bookings
            </Link>
          }
        />
      </div>
    );
  return (
    <div className="page-wrap wrap confirmation-page">
      <div className="success-orb">
        <Check size={31} />
      </div>
      <div className="section-kicker">THAT'S A WRAP</div>
      <h1>
        You're going to the <em>movies.</em>
      </h1>
      <p className="section-sub">
        Your demo booking is confirmed. Have a wonderful show!
      </p>
      <div className="ticket-card">
        <div className="ticket-top">
          <img src={booking.poster} alt="" />
          <div>
            <span className="ticket-label">CINEBOOK · ADMIT ONE</span>
            <h2>{booking.movieTitle}</h2>
            <p>{booking.theatre}</p>
            <div className="ticket-details">
              <span>
                <CalendarDays size={14} />
                {booking.date}
              </span>
              <span>
                <Clock3 size={14} />
                {booking.time}
              </span>
            </div>
          </div>
        </div>
        <div className="ticket-perforation">
          <i />
          <span />
          <i />
        </div>
        <div className="ticket-bottom">
          <div>
            <span>SEATS</span>
            <b>{booking.seats.join(", ")}</b>
          </div>
          <div>
            <span>BOOKING ID</span>
            <b>{booking.id}</b>
          </div>
          <div>
            <span>AMOUNT</span>
            <b>{money(booking.amount)}</b>
          </div>
          <div className="fake-qr" aria-label="Decorative demo QR placeholder">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
        <div className="demo-ticket-note">
          DEMO TICKET · NOT VALID FOR ENTRY
        </div>
      </div>
      <div className="confirmation-actions">
        <Link className="btn btn-primary" to="/my-bookings">
          View my bookings <ArrowRight size={16} />
        </Link>
        <Link className="btn btn-glass" to="/movies">
          Book another movie
        </Link>
      </div>
    </div>
  );
}
function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@"))
      return setError("Please enter a valid email address.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (mode === "register" && name.trim().length < 2)
      return setError("Please enter your full name.");
    const display =
      mode === "register" ? name.trim() : name.trim() || email.split("@")[0];
    onLogin(display);
    navigate("/");
  };
  return (
    <div className="auth-page">
      <div className="auth-decoration">
        <div className="auth-ring ring-one" />
        <div className="auth-ring ring-two" />
        <div className="auth-poster-stack">
          <div />
          <div />
          <div />
        </div>
        <div className="auth-quote">
          “Cinema is a mirror by which we often see ourselves.”
          <span>— A LITTLE MOVIE MAGIC</span>
        </div>
      </div>
      <div className="auth-panel">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Back home
        </Link>
        <div className="auth-form-wrap">
          <div className="brand auth-brand">
            <span className="brand-mark">
              <Clapperboard size={20} />
            </span>
            <span>
              Cine<span className="brand-red">Book</span>
              <small>YOUR NEXT SCENE</small>
            </span>
          </div>
          <div className="section-kicker">YOUR FRONT ROW STARTS HERE</div>
          <h1>{mode === "login" ? "Welcome back." : "Join the show."}</h1>
          <p>
            {mode === "login"
              ? "Your next movie night is just a few clicks away."
              : "Create your account and make every movie night count."}
          </p>
          <form onSubmit={submit} className="auth-form">
            {mode === "register" && (
              <label>
                Full name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                />
              </label>
            )}
            {mode === "login" && (
              <label>
                Name (optional)
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should we call you?"
                />
              </label>
            )}
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </label>
            {error && (
              <div className="form-error">
                <CircleHelp size={15} />
                {error}
              </div>
            )}
            <button className="btn btn-primary auth-submit">
              {mode === "login" ? "Sign in" : "Create account"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>
          <div className="auth-switch">
            {mode === "login" ? "New to CineBook?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </div>
          <div className="auth-demo-note">
            <ShieldCheck size={14} /> Prototype only — credentials are not sent
            to a server.
          </div>
        </div>
      </div>
    </div>
  );
}
function MyBookings({
  bookings,
  user,
}: {
  bookings: Booking[];
  user: string | null;
}) {
  const [items, setItems] = useState<Booking[]>(getBookings());
  useEffect(() => setItems(getBookings()), [bookings.length]);
  const cancel = (id: string) => {
    const next = items.map((b) =>
      b.id === id ? { ...b, status: "Cancelled (demo)" } : b,
    );
    saveBookings(next);
    setItems(next);
  };
  return (
    <div className="page-wrap wrap">
      <div className="page-title-row">
        <div>
          <div className="section-kicker">YOUR MOVIE DIARY</div>
          <h1>
            My <em>bookings.</em>
          </h1>
          <p>All your movie plans, in one place.</p>
        </div>
        <Link to="/movies" className="btn btn-primary">
          <Plus size={16} /> Book a movie
        </Link>
      </div>
      {!user && (
        <div className="inline-notice">
          <UserRound size={18} />
          <span>
            You're browsing as a guest. <Link to="/login">Sign in</Link> to
            personalize your experience.
          </span>
        </div>
      )}
      {items.length ? (
        <div className="booking-history">
          {items.map((b) => (
            <article className="history-card" key={b.id}>
              <img src={b.poster} alt="" />
              <div className="history-main">
                <span
                  className={`status-tag ${b.status.startsWith("Confirmed") ? "confirmed" : "cancelled"}`}
                >
                  {b.status}
                </span>
                <h3>{b.movieTitle}</h3>
                <p>{b.theatre}</p>
                <div className="history-meta">
                  <span>
                    <CalendarDays size={14} />
                    {b.date}
                  </span>
                  <span>
                    <Clock3 size={14} />
                    {b.time}
                  </span>
                  <span>
                    <Armchair size={14} />
                    {b.seats.join(", ")}
                  </span>
                </div>
                <small>Booking ID: {b.id}</small>
              </div>
              <div className="history-price">
                <span>TOTAL</span>
                <b>{money(b.amount)}</b>
                {b.status === "Confirmed" && (
                  <button onClick={() => cancel(b.id)} className="cancel-link">
                    Cancel demo booking
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Your next movie night awaits"
          text="You haven't made any bookings yet. Find a film, pick your seats and we'll keep your ticket right here."
          action={
            <Link to="/movies" className="btn btn-primary">
              Explore movies <ArrowRight size={16} />
            </Link>
          }
        />
      )}
    </div>
  );
}
function Admin({ notify }: { notify: (s: string) => void }) {
  const [tab, setTab] = useState("Overview");
  const [movieList, setMovieList] = useState(movies);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Drama");
  const [language, setLanguage] = useState("Hindi");
  const [price, setPrice] = useState("250");
  const [editing, setEditing] = useState<string | null>(null);
  const bookings = getBookings();
  const tabs = [
    "Overview",
    "Movies",
    "Theatres",
    "Screens & Seats",
    "Shows",
    "Customers",
    "Bookings",
    "Payments",
  ];
  const addMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (editing) {
      setMovieList((prev) =>
        prev.map((m) =>
          m.id === editing
            ? {
                ...m,
                title: title.trim(),
                genre,
                language,
                price: Number(price),
              }
            : m,
        ),
      );
      notify("Movie updated in this demo session.");
    } else {
      setMovieList((prev) => [
        {
          id,
          title: title.trim(),
          genre,
          language,
          price: Number(price),
          duration: "2h 00m",
          rating: "—",
          year: 2026,
          certificate: "UA",
          poster: `https://placehold.co/500x750/17171e/e8e8ee?text=${encodeURIComponent(title)}`,
          backdrop: "",
          synopsis:
            "A new CineBook listing. Add more details when connecting the backend.",
          cast: ["Cast to be announced"],
          director: "TBA",
          status: "Now Showing",
        },
        ...prev,
      ]);
      notify("Movie added to demo list.");
    }
    setTitle("");
    setPrice("250");
    setShowAdd(false);
    setEditing(null);
  };
  const remove = (id: string) => {
    setMovieList((prev) => prev.filter((m) => m.id !== id));
    notify("Movie removed from demo list.");
  };
  return (
    <div className="admin-page wrap">
      <div className="admin-title">
        <div>
          <div className="section-kicker">CINEBOOK CONTROL ROOM</div>
          <h1>
            Admin <em>dashboard.</em>
          </h1>
          <p>Manage your cinema universe from one place.</p>
        </div>
        <span className="demo-admin-badge">
          <span className="live-dot" /> DEMO MODE
        </span>
      </div>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-label">WORKSPACE</div>
          {tabs.map((t, i) => {
            const Icon = [
              LayoutDashboard,
              Film,
              MapPin,
              Armchair,
              CalendarDays,
              UserRound,
              Ticket,
              CreditCard,
            ][i];
            return (
              <button
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                <Icon size={16} />
                {t}
                {t === "Bookings" && bookings.length > 0 && (
                  <span className="nav-count">{bookings.length}</span>
                )}
              </button>
            );
          })}
          <div className="admin-sidebar-foot">
            <ShieldCheck size={15} />
            <span>
              Frontend demo
              <br />
              <small>Not secure / not connected</small>
            </span>
          </div>
        </aside>
        <section className="admin-content">
          <div className="admin-content-heading">
            <div>
              <h2>{tab}</h2>
              <p>
                {tab === "Overview"
                  ? "A quick look at your booking activity."
                  : `Manage ${tab.toLowerCase()} in the prototype.`}
              </p>
            </div>
            {tab === "Movies" && (
              <button
                className="btn btn-primary small-btn"
                onClick={() => {
                  setEditing(null);
                  setTitle("");
                  setShowAdd(true);
                }}
              >
                <Plus size={15} /> Add movie
              </button>
            )}
          </div>
          {tab === "Overview" ? (
            <>
              <div className="admin-stats">
                <div>
                  <span>TOTAL MOVIES</span>
                  <b>{movieList.length}</b>
                  <small>
                    <Film size={13} /> In catalogue
                  </small>
                </div>
                <div>
                  <span>THEATRES</span>
                  <b>{theatres.length}</b>
                  <small>
                    <MapPin size={13} /> Sample locations
                  </small>
                </div>
                <div>
                  <span>BOOKINGS</span>
                  <b>{bookings.length}</b>
                  <small>
                    <Ticket size={13} /> Browser demo
                  </small>
                </div>
                <div>
                  <span>MOCK REVENUE</span>
                  <b>
                    {money(
                      bookings
                        .filter((b) => b.status === "Confirmed")
                        .reduce((a, b) => a + b.amount, 0),
                    )}
                  </b>
                  <small>
                    <CreditCard size={13} /> Demo only
                  </small>
                </div>
              </div>
              <div className="admin-lower-grid">
                <div className="admin-table-card">
                  <div className="table-card-head">
                    <h3>Recent bookings</h3>
                    <button onClick={() => setTab("Bookings")}>
                      View all <ArrowRight size={13} />
                    </button>
                  </div>
                  {bookings.length ? (
                    <div className="mini-table">
                      {bookings.slice(0, 4).map((b) => (
                        <div key={b.id}>
                          <span className="mini-avatar">
                            {b.customer.slice(0, 1).toUpperCase()}
                          </span>
                          <span>
                            <b>{b.customer}</b>
                            <small>{b.movieTitle}</small>
                          </span>
                          <strong>{money(b.amount)}</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="admin-empty">
                      No bookings yet. Try making a demo booking.
                    </div>
                  )}
                </div>
                <div className="admin-table-card">
                  <div className="table-card-head">
                    <h3>Popular movies</h3>
                    <button onClick={() => setTab("Movies")}>
                      Manage <ArrowRight size={13} />
                    </button>
                  </div>
                  {movieList.slice(0, 4).map((m) => (
                    <div className="popular-row" key={m.id}>
                      <img src={m.poster} alt="" />
                      <span>
                        <b>{m.title}</b>
                        <small>
                          {m.genre} · {m.language}
                        </small>
                      </span>
                      <span className="rating">
                        <Star size={11} fill="currentColor" />
                        {m.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : tab === "Movies" ? (
            <>
              <div className="admin-table">
                <div className="admin-table-row table-head">
                  <span>MOVIE</span>
                  <span>GENRE</span>
                  <span>LANGUAGE</span>
                  <span>PRICE</span>
                  <span>ACTIONS</span>
                </div>
                {movieList.map((m) => (
                  <div className="admin-table-row" key={m.id}>
                    <span className="admin-movie-cell">
                      <img src={m.poster} alt="" />
                      <b>{m.title}</b>
                    </span>
                    <span>{m.genre}</span>
                    <span>{m.language}</span>
                    <span>{money(m.price)}</span>
                    <span className="table-actions">
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditing(m.id);
                          setTitle(m.title);
                          setGenre(m.genre);
                          setLanguage(m.language);
                          setPrice(String(m.price));
                          setShowAdd(true);
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button title="Remove" onClick={() => remove(m.id)}>
                        <Trash2 size={14} />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
              {showAdd && (
                <div className="modal-backdrop">
                  <form className="modal-card admin-modal" onSubmit={addMovie}>
                    <button
                      type="button"
                      className="modal-close"
                      onClick={() => setShowAdd(false)}
                    >
                      <X size={18} />
                    </button>
                    <div className="section-kicker">CATALOGUE MANAGEMENT</div>
                    <h2>{editing ? "Edit movie" : "Add a movie"}</h2>
                    <p>This change only affects the current browser session.</p>
                    <label>
                      Movie title
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </label>
                    <div className="form-row">
                      <label>
                        Genre
                        <select
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                        >
                          {genres
                            .filter((g) => g !== "All Movies")
                            .map((g) => (
                              <option key={g}>{g}</option>
                            ))}
                        </select>
                      </label>
                      <label>
                        Language
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option>Hindi</option>
                          <option>English</option>
                        </select>
                      </label>
                    </div>
                    <label>
                      Ticket price (₹)
                      <input
                        type="number"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </label>
                    <button className="btn btn-primary auth-submit">
                      {editing ? "Save changes" : "Add movie"}{" "}
                      <Check size={16} />
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : tab === "Theatres" ? (
            <div className="admin-theatre-list">
              {theatres.map((t) => (
                <div key={t.id} className="admin-theatre">
                  <div className="theatre-icon">
                    <Film />
                  </div>
                  <div>
                    <b>{t.name}</b>
                    <small>{t.area}</small>
                    <div className="format-tags">
                      {t.formats.map((f) => (
                        <span key={f}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <span className="status-tag confirmed">Active (sample)</span>
                </div>
              ))}
            </div>
          ) : tab === "Screens & Seats" ? (
            <AdminInfo
              icon={<Armchair />}
              title="Screen & seat inventory"
              text="Screens belong to a theatre; seats belong to a screen. Seat availability must be tracked per show, not as one global booked/unbooked flag."
              rows={[
                "PVR Select Citywalk · Screen 1 · 96 seats",
                "INOX Insignia · Screen 2 · 84 seats",
                "Cinépolis DLF Avenue · Screen 1 · 108 seats",
              ]}
            />
          ) : tab === "Shows" ? (
            <AdminInfo
              icon={<CalendarDays />}
              title="Scheduled shows"
              text="A show connects one movie to one screen at a specific date and time, with a ticket price and status."
              rows={theatres.map(
                (t) => `${t.name} · ${t.times[0]} · Sample schedule`,
              )}
            />
          ) : tab === "Customers" ? (
            <AdminInfo
              icon={<UserRound />}
              title="Customer records"
              text="Customer accounts will be stored in MySQL after backend integration. This frontend does not collect or send credentials."
              rows={Array.from(new Set(bookings.map((b) => b.customer)))
                .filter(Boolean)
                .map((n) => `${n} · Created from a demo booking`)}
            />
          ) : tab === "Bookings" ? (
            <>
              {bookings.length ? (
                <div className="admin-table">
                  <div className="admin-table-row table-head">
                    <span>BOOKING ID</span>
                    <span>CUSTOMER</span>
                    <span>MOVIE</span>
                    <span>AMOUNT</span>
                    <span>STATUS</span>
                  </div>
                  {bookings.map((b) => (
                    <div className="admin-table-row" key={b.id}>
                      <span>{b.id}</span>
                      <span>{b.customer}</span>
                      <span>{b.movieTitle}</span>
                      <span>{money(b.amount)}</span>
                      <span>
                        <span
                          className={`status-tag ${b.status === "Confirmed" ? "confirmed" : "cancelled"}`}
                        >
                          {b.status}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-empty large">
                  <Ticket size={28} />
                  <b>No bookings yet</b>
                  <span>Make a demo booking to see it appear here.</span>
                </div>
              )}
            </>
          ) : (
            <>
              {bookings.length ? (
                <div className="admin-table">
                  <div className="admin-table-row table-head">
                    <span>PAYMENT REF</span>
                    <span>BOOKING ID</span>
                    <span>METHOD</span>
                    <span>AMOUNT</span>
                    <span>STATUS</span>
                  </div>
                  {bookings.map((b) => (
                    <div className="admin-table-row" key={b.id}>
                      <span>PAY-{b.id.slice(-5)}</span>
                      <span>{b.id}</span>
                      <span>Demo checkout</span>
                      <span>{money(b.amount)}</span>
                      <span>
                        <span className="status-tag confirmed">Simulated</span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-empty large">
                  <CreditCard size={28} />
                  <b>No payment records yet</b>
                  <span>Payment records appear after a simulated booking.</span>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      <div className="admin-warning">
        <ShieldCheck size={17} />
        <span>
          <b>Prototype notice:</b> Admin changes are held in React state only
          and are not persistent. Before launch, implement server-side
          authentication, role-based authorization, validation and MySQL
          persistence.
        </span>
      </div>
    </div>
  );
}
function AdminInfo({
  icon,
  title,
  text,
  rows,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  rows: string[];
}) {
  return (
    <div className="admin-info">
      <div className="admin-info-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {rows.length > 0 && (
        <div className="admin-info-rows">
          {rows.map((r, i) => (
            <div key={i}>
              <span>{r}</span>
              <span className="status-tag confirmed">Sample</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Film size={25} />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}
function NotFound() {
  return (
    <div className="page-wrap wrap">
      <EmptyState
        title="This scene isn't in the script"
        text="We couldn't find that page. Let's get you back to the movies."
        action={
          <Link className="btn btn-primary" to="/">
            Back to home <ArrowRight size={16} />
          </Link>
        }
      />
    </div>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-main">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Clapperboard size={19} />
          </span>
          <span>
            Cine<span className="brand-red">Book</span>
            <small>YOUR NEXT SCENE</small>
          </span>
        </Link>
        <p>Stories are better on the big screen.</p>
        <div className="footer-links">
          <Link to="/movies">Movies</Link>
          <Link to="/my-bookings">My bookings</Link>
          <Link to="/admin">Admin demo</Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 CineBook. Made for movie people.</span>
        <span>FRONTEND PROTOTYPE · NO REAL PAYMENTS</span>
      </div>
    </footer>
  );
}
export default App;
