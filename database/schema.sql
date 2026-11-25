
-- =========================================
-- CINEBOOK DATABASE SCHEMA
-- MySQL 8+
-- =========================================

-- 1. USERS
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. CUSTOMERS
CREATE TABLE `customers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('customer','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `uq_customers_user_id` (`user_id`),
  CONSTRAINT `fk_customers_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. MOVIES
CREATE TABLE `movies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genre` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration_minutes` smallint unsigned NOT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `release_year` year NOT NULL,
  `certificate` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poster_url` text COLLATE utf8mb4_unicode_ci,
  `backdrop_url` text COLLATE utf8mb4_unicode_ci,
  `synopsis` text COLLATE utf8mb4_unicode_ci,
  `cast_json` json DEFAULT NULL,
  `director` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT '200.00',
  `status` enum('Now Showing','Coming Soon') COLLATE utf8mb4_unicode_ci DEFAULT 'Now Showing',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. THEATRES
CREATE TABLE `theatres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amenities` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. SCREENS
CREATE TABLE `screens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `theatre_id` bigint unsigned NOT NULL,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `format` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_seats` smallint unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_screen_name` (`theatre_id`,`name`),
  CONSTRAINT `screens_ibfk_1`
    FOREIGN KEY (`theatre_id`) REFERENCES `theatres` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 6. SEATS
CREATE TABLE `seats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `screen_id` bigint unsigned NOT NULL,
  `seat_row` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seat_number` smallint unsigned NOT NULL,
  `seat_type` enum('standard','premium','recliner') COLLATE utf8mb4_unicode_ci DEFAULT 'standard',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_seat_position` (`screen_id`,`seat_row`,`seat_number`),
  CONSTRAINT `seats_ibfk_1`
    FOREIGN KEY (`screen_id`) REFERENCES `screens` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 7. SHOWS
CREATE TABLE `shows` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `movie_id` bigint unsigned NOT NULL,
  `screen_id` bigint unsigned NOT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `language` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `format` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_shows_movie_date` (`movie_id`,`starts_at`),
  KEY `idx_shows_screen_date` (`screen_id`,`starts_at`),
  CONSTRAINT `shows_ibfk_1`
    FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  CONSTRAINT `shows_ibfk_2`
    FOREIGN KEY (`screen_id`) REFERENCES `screens` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 8. BOOKINGS
CREATE TABLE `bookings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_code` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `show_id` bigint unsigned NOT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `movie_id` bigint unsigned DEFAULT NULL,
  `show_date` date DEFAULT NULL,
  `show_time` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theatre` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seats` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_code` (`booking_code`),
  KEY `show_id` (`show_id`),
  KEY `idx_bookings_customer` (`customer_id`,`created_at`),
  CONSTRAINT `bookings_ibfk_1`
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `bookings_ibfk_2`
    FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 9. BOOKING SEATS
CREATE TABLE `booking_seats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `show_id` bigint unsigned NOT NULL,
  `seat_id` bigint unsigned NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_show_seat` (`show_id`,`seat_id`),
  KEY `seat_id` (`seat_id`),
  KEY `idx_booking_seats_booking` (`booking_id`),
  CONSTRAINT `booking_seats_ibfk_1`
    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `booking_seats_ibfk_2`
    FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`),
  CONSTRAINT `booking_seats_ibfk_3`
    FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 10. PAYMENTS
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('DEMO','CARD','UPI','NETBANKING') COLLATE utf8mb4_unicode_ci DEFAULT 'DEMO',
  `status` enum('PENDING','SUCCESS','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `transaction_reference` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1`
    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 11. TICKETS
CREATE TABLE `tickets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned NOT NULL,
  `ticket_code` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issued_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_code` (`ticket_code`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `tickets_ibfk_1`
    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
