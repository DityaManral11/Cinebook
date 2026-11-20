CREATE DATABASE IF NOT EXISTS cinebook;
USE cinebook;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  duration VARCHAR(30) NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 8.0,
  language VARCHAR(50) NOT NULL DEFAULT 'Hindi',
  certificate VARCHAR(10) NOT NULL DEFAULT 'UA',
  description TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  banner_url TEXT NOT NULL,
  release_year INT NOT NULL DEFAULT 2026,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  show_date DATE NOT NULL,
  show_time VARCHAR(20) NOT NULL,
  theatre VARCHAR(160) NOT NULL,
  seats VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_code VARCHAR(30) NOT NULL UNIQUE,
  status ENUM('CONFIRMED','CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_booking_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE RESTRICT
);

INSERT INTO movies (title, genre, duration, rating, language, certificate, description, poster_url, banner_url, release_year)
SELECT * FROM (
  SELECT 'Beyond the Stars','Sci-Fi / Adventure','2h 18m',8.7,'English','UA','A crew of explorers discovers a signal beyond the edge of the known universe, changing everything they believe about humanity.','https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600','https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1800',2026
  UNION ALL SELECT 'Midnight Promise','Romance / Drama','2h 04m',8.1,'Hindi','UA','Two strangers cross paths in a city that never sleeps, and learn that the right moment can change a lifetime.','https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600','https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1800',2026
  UNION ALL SELECT 'The Last Clue','Mystery / Thriller','2h 11m',8.4,'Hindi','UA','A sharp young investigator has one night to solve a case where every witness is hiding something.','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800',2026
  UNION ALL SELECT 'Pixel Planet','Animation / Family','1h 46m',7.9,'English','U','A curious inventor and a tiny robot set off on a colourful journey to save their home world.','https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600','https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600',2026
  UNION ALL SELECT 'Redline','Action / Crime','2h 09m',8.2,'Hindi','A','A former racer is pulled into a high-stakes chase through a city full of secrets and shifting loyalties.','https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600','https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1800',2026
  UNION ALL SELECT 'Ocean Between Us','Drama / Romance','1h 58m',7.8,'Hindi','UA','A heartfelt story about family, distance, and the choices that bring people home.','https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600','https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1800',2026
) AS sample
WHERE NOT EXISTS (SELECT 1 FROM movies LIMIT 1);
