-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2025 at 06:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rijik`
--

-- --------------------------------------------------------

--
-- Table structure for table `kendaraan`
--

CREATE TABLE `kendaraan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nomor_polisi` varchar(15) NOT NULL,
  `merk` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `jenis` enum('Mobil','Motor') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kendaraan`
--

INSERT INTO `kendaraan` (`id`, `user_id`, `nomor_polisi`, `merk`, `model`, `jenis`, `created_at`, `updated_at`) VALUES
(1, 2, 'B 1234 ABC', 'Toyota', 'Avanza', 'Mobil', '2025-06-21 08:28:51', '2025-07-15 08:55:51'),
(2, 2, 'B 5678 DEF', 'Honda', 'Brio', 'Mobil', '2025-06-21 08:28:51', '2025-07-15 09:10:13'),
(3, 3, 'B 9012 GHI', 'Suzuki', 'Ertiga', '', '2025-06-21 08:28:51', '2025-06-21 08:28:51'),
(4, 4, 'B 3456 JKL', 'Daihatsu', 'Terios', '', '2025-06-21 08:28:51', '2025-06-21 08:28:51'),
(5, 5, 'B 7890 MNO', 'Mitsubishi', 'Xpander', '', '2025-06-21 08:28:51', '2025-06-21 08:28:51'),
(6, 3, 'B 1122 PQ', 'Hyundai', 'Creta', '', '2025-06-21 08:28:51', '2025-06-21 08:28:51'),
(7, 4, 'B 3344 RS', 'Wuling', 'Almaz', '', '2025-06-21 08:28:51', '2025-06-21 08:28:51'),
(8, 5, 'B 5566 TU', 'Nissan', 'Livina', '', '2025-06-21 08:28:51', '2025-06-21 08:28:51'),
(9, 2, 'B 7788 VW', 'Honda', 'HR-V', 'Mobil', '2025-06-21 08:28:51', '2025-07-15 11:41:12'),
(10, 3, 'B 9900 XY', 'Toyota', 'Rush', '', '2025-06-21 08:28:51', '2025-06-21 08:28:51'),
(14, 2, 'P 1123 L', 'Honda', 'Supra X', 'Motor', '2025-07-15 11:42:22', '2025-07-15 11:42:22');

-- --------------------------------------------------------

--
-- Table structure for table `paket_cuci`
--

CREATE TABLE `paket_cuci` (
  `id` int(11) NOT NULL,
  `nama_paket` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `harga` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paket_cuci`
--

INSERT INTO `paket_cuci` (`id`, `nama_paket`, `deskripsi`, `harga`, `created_at`, `updated_at`) VALUES
(1, 'Cuci Bronze Motor', 'Cuci eksterior cepat untuk motor', 25000.00, '2025-06-21 08:30:45', '2025-07-13 14:41:33'),
(2, 'Cuci Bronze Mobil', 'Cuci eksterior cepat untuk Mobil', 40000.00, '2025-06-21 08:30:45', '2025-07-13 14:42:38'),
(3, 'Cuci Silver Motor', 'Cuci eksterior dan interior untuk Motor', 55000.00, '2025-06-21 08:30:45', '2025-07-13 14:47:29'),
(4, 'Cuci Silver Mobil', 'Cuci eksterior dan interior untuk Mobil', 120000.00, '2025-06-21 08:30:45', '2025-07-13 14:44:56'),
(5, 'Cuci Gold Motor', 'Perawatan profesional dan lengkap dengan bahan premium untuk Motor', 200000.00, '2025-06-21 08:30:45', '2025-07-13 14:45:34'),
(6, 'Cuci Gold Mobil', 'Perawatan profesional dan lengkap dengan bahan premium untuk Mobil', 250000.00, '2025-06-21 08:30:45', '2025-07-13 14:47:04'),
(9, 'Cuci Tes', 'Sangat Keren Sekali', 90000.00, '2025-07-13 18:17:24', '2025-07-13 18:18:38'),
(11, 'Paket Keren', 'KEREN', 3000000.00, '2025-07-14 04:25:38', '2025-07-14 04:25:38');

-- --------------------------------------------------------

--
-- Table structure for table `pesanan`
--

CREATE TABLE `pesanan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `kendaraan_id` int(11) NOT NULL,
  `paket_cuci_id` int(11) NOT NULL,
  `lokasi` text NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  `status` enum('diproses','selesai','dibatalkan') NOT NULL DEFAULT 'diproses',
  `waktu_pesan` timestamp NOT NULL DEFAULT current_timestamp(),
  `waktu_selesai` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pesanan`
--

INSERT INTO `pesanan` (`id`, `user_id`, `kendaraan_id`, `paket_cuci_id`, `lokasi`, `total_harga`, `status`, `waktu_pesan`, `waktu_selesai`, `created_at`, `updated_at`) VALUES
(23, 2, 1, 2, 'Jl. Merdeka No.12', 40000.00, 'selesai', '2025-07-15 09:50:40', NULL, '2025-07-15 09:50:40', '2025-07-15 09:50:56'),
(24, 2, 14, 1, 'Jl. Merdeka No.12', 25000.00, 'selesai', '2025-07-15 11:42:39', NULL, '2025-07-15 11:42:39', '2025-07-15 11:47:26'),
(25, 2, 14, 1, 'Jl. Merdeka No.12', 25000.00, 'selesai', '2025-07-15 11:48:27', NULL, '2025-07-15 11:48:27', '2025-07-15 11:48:39');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `pesanan_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `ulasan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `pesanan_id`, `user_id`, `rating`, `ulasan`, `created_at`) VALUES
(9, 23, 2, 5, 'Bagus!', '2025-07-15 10:50:50'),
(10, 23, 2, 5, 'Bagus!', '2025-07-15 10:52:49'),
(11, 23, 2, 5, 'mwehe', '2025-07-15 11:04:59'),
(12, 24, 2, 4, 'suargo panggonmu', '2025-07-15 11:48:04'),
(13, 25, 2, 3, 'mengecewakan', '2025-07-15 11:48:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `no_telepon` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `no_telepon`, `alamat`, `role`, `created_at`, `updated_at`) VALUES
(2, 'Budi Speed', 'budi@example.com', '$2b$10$q2YPBG44OSPH3VVf/7Xekud12WZ3AELg3qbk2GPJ8HFs5D8iKlPzm', '08234567890', 'Jl. Merdeka No.12', 'user', '2025-06-21 08:26:37', '2025-07-15 11:40:53'),
(3, 'Ani Wijaya', 'ani@example.com', '$2b$10$DR6d4eWxijfqgAG9vuQuGep.Zv/2GlUMCmqDzT0232ii0ow.KJ.dy', '08345678901', 'Jl. Sudirman No.45', 'user', '2025-06-21 08:26:37', '2025-07-13 04:02:56'),
(4, 'Citra Dewi', 'citra@example.com', '$2b$10$c/5OXwpbhMNakVF2g.qrZOnn7.I1IZiyKahFW8uTuVSHh56s4F6WC', '08456789012', 'Jl. Gatot Subroto No.8', 'user', '2025-06-21 08:26:37', '2025-07-13 04:03:07'),
(5, 'Dodi Pratama', 'dodi@example.com', '$2b$10$v87Ty7SNn6yNWka7rvkUkuYQQoFUXUy0ezFcoUMB./r4RHr8SzEB2', '08567890123', 'Jl. Thamrin No.22', 'user', '2025-06-21 08:26:37', '2025-07-13 04:03:17'),
(6, 'Admin1', 'admin1@gmail.com', '$2b$10$Fem37j3TZfKlK49R5xd8QuXJ6iqdjHA8mbO1qIY6O77vb2uzFsXx2', '08123456789', 'Kantor', 'admin', '2025-07-13 04:32:03', '2025-07-13 04:34:08'),
(7, 'Admin2', 'admin2@gmail.com', '$2b$10$Ahnh7HLTINwbm8eDYC96cOMNeMc.SwDAbdrO4/UlYDSleyjF1px3e', '08121456717', 'Kantor', 'admin', '2025-07-13 04:32:25', '2025-07-13 04:34:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kendaraan`
--
ALTER TABLE `kendaraan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_polisi` (`nomor_polisi`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `paket_cuci`
--
ALTER TABLE `paket_cuci`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kendaraan_id` (`kendaraan_id`),
  ADD KEY `paket_cuci_id` (`paket_cuci_id`),
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`) USING BTREE,
  ADD KEY `pesanan_id` (`pesanan_id`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kendaraan`
--
ALTER TABLE `kendaraan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `paket_cuci`
--
ALTER TABLE `paket_cuci`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kendaraan`
--
ALTER TABLE `kendaraan`
  ADD CONSTRAINT `kendaraan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pesanan_ibfk_2` FOREIGN KEY (`kendaraan_id`) REFERENCES `kendaraan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pesanan_ibfk_3` FOREIGN KEY (`paket_cuci_id`) REFERENCES `paket_cuci` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
