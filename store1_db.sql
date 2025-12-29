-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 28, 2025 at 07:21 PM
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
-- Database: `store1_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_details` text NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `customer_email`, `address`, `total_price`, `order_details`, `order_date`) VALUES
(1, 'Hana Abdelkader Attia', 'hana.abdelkader583@gmail.com', 'borg el arab', 45.00, 'Leather Belt (x1)', '2025-12-28 16:08:25');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`) VALUES
(1, 'Leather Wallet', 'Accessories', 65.00, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'),
(2, 'Designer Sunglasses', 'Accessories', 120.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'),
(3, 'Leather Belt', 'Accessories', 35.00, 'https://images.pexels.com/photos/31959215/pexels-photo-31959215.jpeg'),
(4, 'Watch', 'Accessories', 250.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
(5, 'Running Shoes', 'Shoes', 95.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
(6, 'Casual Sneakers', 'Shoes', 75.00, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'),
(7, 'Leather Boots', 'Shoes', 150.00, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400'),
(8, 'Canvas Shoes', 'Shoes', 55.00, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400'),
(9, 'Cotton T-Shirt', 'Clothes', 25.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
(10, 'Denim Jeans', 'Clothes', 65.00, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'),
(11, 'Hoodie', 'Clothes', 55.00, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'),
(12, 'Summer Dress', 'Clothes', 85.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'),
(13, 'sweatshirt', 'Accessories', 90.00, 'https://images.pexels.com/photos/1472623/pexels-photo-1472623.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `created_at`) VALUES
(1, 'hana', 'hana.abdelkader583@gmail.com', '1232456', '2025-12-28 15:32:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
