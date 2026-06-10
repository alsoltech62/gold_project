-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 10, 2026 at 03:53 PM
-- Server version: 10.6.27-MariaDB
-- PHP Version: 8.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodplus_gold`
--

-- --------------------------------------------------------

--
-- Table structure for table `delivery_requests`
--

CREATE TABLE `delivery_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `gold_grams` decimal(10,4) NOT NULL,
  `delivery_address` text NOT NULL,
  `delivery_city` varchar(100) DEFAULT NULL,
  `delivery_state` varchar(100) DEFAULT NULL,
  `delivery_pincode` varchar(10) DEFAULT NULL,
  `status` enum('pending','processing','dispatched','delivered','cancelled') DEFAULT 'pending',
  `tracking_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `delivery_requests`
--

INSERT INTO `delivery_requests` (`id`, `user_id`, `transaction_id`, `gold_grams`, `delivery_address`, `delivery_city`, `delivery_state`, `delivery_pincode`, `status`, `tracking_number`, `notes`, `created_at`, `updated_at`) VALUES
(0, 0, 0, 1.0072, 'belun, kolkata, West Bengal - 713140', 'kolkata', 'West Bengal', '713140', 'pending', NULL, NULL, '2026-05-18 03:57:18', '2026-05-18 03:57:18'),
(0, 0, 0, 10.0000, 'belun, kolkata, West Bengal - 713140', 'kolkata', 'West Bengal', '713140', 'pending', NULL, NULL, '2026-05-18 03:57:36', '2026-05-18 03:57:36');

-- --------------------------------------------------------

--
-- Table structure for table `gold_rates`
--

CREATE TABLE `gold_rates` (
  `id` int(11) NOT NULL,
  `rate_per_gram` decimal(10,2) NOT NULL,
  `rate_date` date NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gold_rates`
--

INSERT INTO `gold_rates` (`id`, `rate_per_gram`, `rate_date`, `updated_by`, `created_at`) VALUES
(1, 520000.00, '2026-05-06', 1, '2026-05-06 11:40:10'),
(4, 100.00, '2026-05-11', 1, '2026-05-11 03:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `type` enum('transaction','gold_rate','delivery','general') DEFAULT 'general',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 2, 'Gold Rate Updated', 'Today\'s gold rate: ₹1000/gram', 'gold_rate', 0, '2026-05-06 12:39:42'),
(2, 2, 'Gold Rate Updated', 'Today\'s gold rate: ₹520000/gram', 'gold_rate', 0, '2026-05-06 12:40:13'),
(3, 2, 'Gold Rate Updated', 'Today\'s gold rate: ₹0.02/gram', 'gold_rate', 0, '2026-05-11 03:45:55'),
(4, 7, 'Gold Rate Updated', 'Today\'s gold rate: ₹0.02/gram', 'gold_rate', 0, '2026-05-11 03:45:55'),
(6, 2, 'Gold Rate Updated', 'Today\'s gold rate: ₹100.00/gram', 'gold_rate', 0, '2026-05-11 03:49:33'),
(7, 7, 'Gold Rate Updated', 'Today\'s gold rate: ₹100.00/gram', 'gold_rate', 0, '2026-05-11 03:49:33'),
(9, 2, 'Sell Request Submitted', 'Sell request for 10g (≈₹1000) is under review', 'transaction', 0, '2026-05-11 03:53:49'),
(10, 2, 'Transaction Updated', 'Your sell request for 10.0000g has been completed', 'transaction', 0, '2026-05-11 03:54:15'),
(0, 2, 'Gold Purchase Successful', 'You bought 1g gold for ₹100', 'transaction', 0, '2026-05-12 15:48:26'),
(0, 1, 'Gold Purchase Successful', 'You bought 58.88g gold for ₹5888', 'transaction', 0, '2026-05-13 11:09:34'),
(0, 2, 'Silver Purchase Successful', 'You bought 1.1765g silver for ₹100', 'transaction', 0, '2026-05-14 06:35:56'),
(0, 0, 'Silver Purchase Successful', 'You bought 5.8824g silver for ₹500', 'transaction', 0, '2026-05-14 09:10:29'),
(0, 0, 'Silver Purchase Successful', 'You bought 5.8824g silver for ₹500', 'transaction', 0, '2026-05-17 04:38:01'),
(0, 0, 'Silver Sold Successful', 'You sold 5g silver for ₹425', 'transaction', 0, '2026-05-17 04:38:38'),
(0, 0, 'Gold Purchase Successful', 'You bought 5g gold for ₹500', 'transaction', 0, '2026-05-17 04:41:54'),
(0, 0, 'Silver Purchase Successful', 'You bought 5.8824g silver for ₹500', 'transaction', 0, '2026-05-17 04:43:38'),
(0, 0, 'Gold Purchase Successful', 'You bought 5g gold for ₹500', 'transaction', 0, '2026-05-18 03:45:55'),
(0, 2, 'Sell Request Submitted', 'Sell request for 1g (≈₹100) is under review', 'transaction', 0, '2026-05-18 03:56:15'),
(0, 0, 'Delivery Requested', 'Delivery request for 1.0072g gold has been placed', 'delivery', 0, '2026-05-18 03:57:18'),
(0, 0, 'Delivery Requested', 'Delivery request for 10g gold has been placed', 'delivery', 0, '2026-05-18 03:57:36'),
(0, 2, 'Transaction Updated', 'Your buy request for 1.0000g has been completed', 'transaction', 0, '2026-05-18 03:58:12'),
(0, 2, 'Gold Purchase Successful', 'You bought 5g gold for ₹500', 'transaction', 0, '2026-05-29 17:03:24'),
(0, 2, 'Sell Request Submitted', 'Sell request for 2g (≈₹200) is under review', 'transaction', 0, '2026-05-29 17:03:46'),
(0, 2, 'Gold Purchase Successful', 'You bought 5g gold for ₹500', 'transaction', 0, '2026-06-05 17:07:30'),
(0, 2, 'Sell Request Submitted', 'Sell request for 1g (≈₹100) is under review', 'transaction', 0, '2026-06-05 17:09:54'),
(0, 2, 'Sell Request Submitted', 'Sell request for 1g (≈₹100) is under review', 'transaction', 0, '2026-06-05 17:12:54'),
(0, 2, 'Gold Purchase Successful', 'You bought 5g gold for ₹500', 'transaction', 0, '2026-06-05 17:14:41'),
(0, 2, 'Gold Purchase Successful', 'You bought 5g gold for ₹500', 'transaction', 0, '2026-06-05 17:33:13'),
(0, 2, 'Sell Request Submitted', 'Sell request for 1g (≈₹100) is under review', 'transaction', 0, '2026-06-05 17:33:32'),
(0, 2, 'Gold Purchase Successful', 'You bought 5g gold for ₹500', 'transaction', 0, '2026-06-05 17:34:00'),
(0, 2, 'Gold Purchase Successful', 'You bought 5g gold for ₹500', 'transaction', 0, '2026-06-06 06:44:21'),
(0, 2, 'Silver Purchase Successful', 'You bought 1.1765g silver for ₹100', 'transaction', 0, '2026-06-06 06:44:53'),
(0, 2, 'Silver Sold Successful', 'You sold 2g silver for ₹170', 'transaction', 0, '2026-06-06 06:45:12'),
(0, NULL, 'hii', 'hrlll', 'general', 0, '2026-06-06 14:33:29');

-- --------------------------------------------------------

--
-- Table structure for table `silver_rates`
--

CREATE TABLE `silver_rates` (
  `id` int(11) NOT NULL,
  `rate_per_gram` decimal(10,2) NOT NULL,
  `rate_date` date NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `silver_rates`
--

INSERT INTO `silver_rates` (`id`, `rate_per_gram`, `rate_date`, `updated_by`, `created_at`) VALUES
(1, 85.00, '2026-05-14', NULL, '2026-05-14 06:23:50'),
(2, 85.00, '2026-05-18', NULL, '2026-05-18 03:55:55');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('open','pending','closed') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `user_id`, `subject`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 0, 'Balance issue ', '1000 balance not added my profile ', 'closed', '2026-05-14 09:19:02', '2026-05-14 09:30:13'),
(2, 2, 'jjhj', 'jukjjk', 'open', '2026-05-17 04:13:30', '2026-05-17 04:13:30');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('buy','sell','delivery') NOT NULL,
  `amount_inr` decimal(12,2) DEFAULT NULL,
  `gold_grams` decimal(10,4) DEFAULT NULL,
  `gold_rate` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','completed','rejected','processing') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_id` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `metal_type` enum('gold','silver') DEFAULT 'gold',
  `transaction_source` enum('direct','sip','referral','wallet') DEFAULT 'direct'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `type`, `amount_inr`, `gold_grams`, `gold_rate`, `status`, `payment_method`, `payment_id`, `notes`, `created_by`, `created_at`, `updated_at`, `metal_type`, `transaction_source`) VALUES
(3, 1, 'delivery', 100.00, 10.0000, 100.00, 'completed', 'manual', NULL, 'trs', 1, '2026-05-11 03:50:13', '2026-05-11 03:50:13', 'gold', 'direct'),
(4, 2, 'buy', 1000.00, 10.0000, 100.00, 'completed', 'manual', NULL, '10', 1, '2026-05-11 03:51:22', '2026-05-11 03:51:22', 'gold', 'direct'),
(5, 2, 'sell', 1000.00, 10.0000, 100.00, 'completed', NULL, NULL, '', NULL, '2026-05-11 03:53:49', '2026-05-11 03:54:15', 'gold', 'direct'),
(0, 2, 'buy', 100.00, 1.0000, 100.00, 'completed', 'UPI', 'MOCK_TXN_1778600905457', '', NULL, '2026-05-12 15:48:26', '2026-05-18 03:58:12', 'gold', 'direct'),
(0, 1, 'buy', 5888.00, 58.8800, 100.00, 'completed', 'UPI', 'MOCK_TXN_1778670572507', '', NULL, '2026-05-13 11:09:34', '2026-05-18 03:58:12', 'gold', 'direct'),
(0, 2, '', 100.00, NULL, NULL, 'completed', NULL, NULL, '', NULL, '2026-05-14 06:27:49', '2026-05-18 03:58:12', 'gold', 'wallet'),
(0, 2, 'buy', 100.00, 1.1765, 85.00, 'completed', 'UPI', NULL, '', NULL, '2026-05-14 06:35:56', '2026-05-18 03:58:12', 'silver', 'direct'),
(0, 0, '', 1000.00, NULL, NULL, 'completed', NULL, NULL, '', NULL, '2026-05-14 09:09:36', '2026-05-18 03:58:12', 'gold', 'wallet'),
(0, 0, 'buy', 1000.00, 10.0000, 100.00, 'completed', NULL, NULL, '', NULL, '2026-05-14 09:09:36', '2026-05-18 03:58:12', 'gold', 'wallet'),
(0, 0, 'buy', 500.00, 5.8824, 85.00, 'completed', 'UPI', NULL, '', NULL, '2026-05-14 09:10:29', '2026-05-18 03:58:12', 'silver', 'direct'),
(0, 2, '', 100.00, NULL, NULL, 'completed', NULL, NULL, '', NULL, '2026-05-17 03:57:33', '2026-05-18 03:58:12', 'gold', 'wallet'),
(0, 0, 'sell', 500.00, 5.0000, 100.00, 'completed', 'wallet', NULL, '', NULL, '2026-05-17 04:38:01', '2026-05-18 03:58:12', 'gold', 'direct'),
(0, 0, 'buy', 500.00, 5.8824, 85.00, 'completed', 'gold_wallet', NULL, '', NULL, '2026-05-17 04:38:01', '2026-05-18 03:58:12', 'silver', 'direct'),
(0, 0, 'sell', 425.00, 5.0000, 85.00, 'completed', NULL, NULL, '', NULL, '2026-05-17 04:38:38', '2026-05-18 03:58:12', 'silver', 'direct'),
(0, 0, '', 1000.00, NULL, NULL, 'completed', NULL, NULL, '', NULL, '2026-05-17 04:38:59', '2026-05-18 03:58:12', 'gold', 'wallet'),
(0, 0, 'buy', 1000.00, 10.0000, 100.00, 'completed', NULL, NULL, '', NULL, '2026-05-17 04:38:59', '2026-05-18 03:58:12', 'gold', 'wallet'),
(0, 0, 'sell', 500.00, 5.8824, 85.00, 'completed', 'wallet', NULL, '', NULL, '2026-05-17 04:41:54', '2026-05-18 03:58:12', 'silver', 'direct'),
(0, 0, 'buy', 500.00, 5.0000, 100.00, 'completed', 'silver_wallet', 'MOCK_TXN_1778992912500', '', NULL, '2026-05-17 04:41:54', '2026-05-18 03:58:12', 'gold', 'direct'),
(0, 0, 'sell', 500.00, 5.0000, 100.00, 'completed', 'wallet', NULL, '', NULL, '2026-05-17 04:43:38', '2026-05-18 03:58:12', 'gold', 'direct'),
(0, 0, 'buy', 500.00, 5.8824, 85.00, 'completed', 'gold_wallet', NULL, '', NULL, '2026-05-17 04:43:38', '2026-05-18 03:58:12', 'silver', 'direct'),
(0, 2, 'buy', 100.00, 1.0000, 100.00, 'completed', NULL, NULL, '', NULL, '2026-05-17 04:48:31', '2026-05-18 03:58:12', 'gold', 'sip'),
(0, 0, '', 100.00, NULL, NULL, 'completed', NULL, NULL, '', NULL, '2026-05-18 03:24:48', '2026-05-18 03:58:12', 'gold', 'wallet'),
(0, 0, 'buy', 100.00, 1.0000, 100.00, 'completed', NULL, NULL, '', NULL, '2026-05-18 03:44:39', '2026-05-18 03:58:12', 'gold', 'sip'),
(0, 0, 'sell', 500.00, 5.8824, 85.00, 'completed', 'wallet', NULL, '', NULL, '2026-05-18 03:45:55', '2026-05-18 03:58:12', 'silver', 'direct'),
(0, 0, 'buy', 500.00, 5.0000, 100.00, 'completed', 'silver_wallet', 'WALLET_TXN', '', NULL, '2026-05-18 03:45:55', '2026-05-18 03:58:12', 'gold', 'direct'),
(0, 2, 'sell', 100.00, 1.0000, 100.00, 'completed', NULL, NULL, '', NULL, '2026-05-18 03:56:15', '2026-05-18 03:58:12', 'gold', 'direct'),
(0, 0, 'delivery', NULL, 1.0072, 100.00, 'completed', NULL, NULL, '', NULL, '2026-05-18 03:57:18', '2026-05-18 03:58:12', 'gold', 'direct'),
(0, 0, 'delivery', NULL, 10.0000, 100.00, 'completed', NULL, NULL, '', NULL, '2026-05-18 03:57:36', '2026-05-18 03:58:12', 'gold', 'direct'),
(0, 0, '', 100.00, NULL, NULL, 'completed', NULL, NULL, 'INR Deposit', NULL, '2026-05-18 03:58:41', '2026-05-18 03:58:41', 'gold', 'wallet'),
(0, 2, 'buy', 500.00, 5.0000, 100.00, 'completed', 'UPI', 'MOCK_TXN_1780074202936', NULL, NULL, '2026-05-29 17:03:24', '2026-05-29 17:03:24', 'gold', 'direct'),
(0, 2, 'sell', 200.00, 2.0000, 100.00, 'pending', NULL, NULL, NULL, NULL, '2026-05-29 17:03:46', '2026-05-29 17:03:46', 'gold', 'direct'),
(0, 2, 'buy', 500.00, 5.0000, 100.00, 'completed', 'UPI', 'MOCK_TXN_1780679246108', NULL, NULL, '2026-06-05 17:07:30', '2026-06-05 17:07:30', 'gold', 'direct'),
(0, 2, 'sell', 100.00, 1.0000, 100.00, 'pending', NULL, NULL, NULL, NULL, '2026-06-05 17:09:54', '2026-06-05 17:09:54', 'gold', 'direct'),
(0, 2, 'sell', 100.00, 1.0000, 100.00, 'pending', NULL, NULL, NULL, NULL, '2026-06-05 17:12:54', '2026-06-05 17:12:54', 'gold', 'direct'),
(0, 2, 'buy', 500.00, 5.0000, 100.00, 'completed', 'UPI', 'MOCK_TXN_1780679679067', NULL, NULL, '2026-06-05 17:14:41', '2026-06-05 17:14:41', 'gold', 'direct'),
(0, 2, 'buy', 500.00, 5.0000, 100.00, 'completed', 'UPI', 'MOCK_TXN_1780680791536', NULL, NULL, '2026-06-05 17:33:13', '2026-06-05 17:33:13', 'gold', 'direct'),
(0, 2, 'sell', 100.00, 1.0000, 100.00, 'pending', NULL, NULL, NULL, NULL, '2026-06-05 17:33:32', '2026-06-05 17:33:32', 'gold', 'direct'),
(0, 2, 'buy', 500.00, 5.0000, 100.00, 'completed', 'UPI', 'MOCK_TXN_1780680839101', NULL, NULL, '2026-06-05 17:34:00', '2026-06-05 17:34:00', 'gold', 'direct'),
(0, 2, 'buy', 500.00, 5.0000, 100.00, 'completed', 'UPI', 'MOCK_TXN_1780728259750', NULL, NULL, '2026-06-06 06:44:21', '2026-06-06 06:44:21', 'gold', 'direct'),
(0, 2, 'sell', 100.00, 1.0000, 100.00, 'completed', 'wallet', NULL, 'Sold to buy Silver', NULL, '2026-06-06 06:44:53', '2026-06-06 06:44:53', 'gold', 'direct'),
(0, 2, 'buy', 100.00, 1.1765, 85.00, 'completed', 'gold_wallet', NULL, NULL, NULL, '2026-06-06 06:44:53', '2026-06-06 06:44:53', 'silver', 'direct'),
(0, 2, 'sell', 170.00, 2.0000, 85.00, 'completed', NULL, NULL, NULL, NULL, '2026-06-06 06:45:12', '2026-06-06 06:45:12', 'silver', 'direct');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `aadhar_number` varchar(20) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_admin` tinyint(1) DEFAULT 0,
  `otp` varchar(10) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `inr_wallet` decimal(12,2) DEFAULT 0.00,
  `silver_wallet` decimal(10,4) DEFAULT 0.0000,
  `sip_active` tinyint(1) DEFAULT 0,
  `sip_amount` decimal(10,2) DEFAULT 0.00,
  `sip_frequency` enum('daily','monthly') DEFAULT 'monthly',
  `sip_last_deducted` datetime DEFAULT NULL,
  `referred_by` int(11) DEFAULT NULL,
  `japsan_wallet` decimal(12,2) DEFAULT 0.00,
  `fcm_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `mobile`, `email`, `address`, `city`, `state`, `pincode`, `aadhar_number`, `pan_number`, `profile_photo`, `is_active`, `is_admin`, `otp`, `otp_expires_at`, `created_at`, `updated_at`, `inr_wallet`, `silver_wallet`, `sip_active`, `sip_amount`, `sip_frequency`, `sip_last_deducted`, `referred_by`, `japsan_wallet`, `fcm_token`) VALUES
(1, 'Admin', '9999999999', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '123456', '2026-06-09 15:45:51', '2026-05-06 11:40:10', '2026-06-09 15:40:51', 0.00, 0.0000, 0, 0.00, 'monthly', NULL, NULL, 0.00, NULL),
(2, 'Koushik ghosh', '6296488643', '', 'belun', 'kolkata', 'West Bengal', '713140', '', '', NULL, 1, 0, '123456', '2026-06-07 06:29:35', '2026-05-06 12:18:31', '2026-06-07 13:04:49', 100.00, 0.0000, 1, 100.00, 'monthly', '2026-05-17 04:48:31', NULL, 0.00, 'f26qLXSOQBarLhiURSY7XM:APA91bF7UheAXhOE7u5CGxV7rQkZZwGcgrcuc681LEyPcIsgLy7WU6Ti7GinuKUOsjaWyqZgjPzMD9DNuDhAYoVAmMaGKRK39kDZLoxwb-XG0cdRWJpYSRo'),
(7, 'Koushik ghosh', '6296488644', 'kg@gmail.com', 'belun', 'kolkata', 'West Bengal', '713140', '202020202020', 'ABCDE1234F', NULL, 1, 0, '123456', '2026-05-11 05:48:20', '2026-05-11 03:43:00', '2026-05-11 03:43:20', 0.00, 0.0000, 0, 0.00, 'monthly', NULL, NULL, 0.00, NULL),
(0, 'Provat mondal', '9647457831', 'gulludas990@gmail.com', 'Kolkata', 'Kolkata', 'West Bengal', '700001', '000088889999', 'Fuxth5823d', NULL, 1, 0, '123456', '2026-06-07 07:05:52', '2026-05-13 11:10:33', '2026-06-07 07:00:52', 100.00, 0.0000, 1, 100.00, 'monthly', '2026-05-18 03:44:39', NULL, 0.00, NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_gold_summary`
-- (See below for the actual view)
--
CREATE TABLE `user_gold_summary` (
`user_id` int(11)
,`name` varchar(100)
,`mobile` varchar(15)
,`total_gold_grams` decimal(33,4)
,`total_invested_inr` decimal(34,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_summary`
-- (See below for the actual view)
--
CREATE TABLE `user_summary` (
`user_id` int(11)
,`name` varchar(100)
,`mobile` varchar(15)
,`inr_wallet` decimal(12,2)
,`silver_wallet` decimal(10,4)
,`japsan_wallet` decimal(12,2)
,`total_gold_grams` decimal(33,4)
,`total_silver_grams` decimal(33,4)
,`total_invested_inr` decimal(34,2)
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `silver_rates`
--
ALTER TABLE `silver_rates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rate_date` (`rate_date`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `silver_rates`
--
ALTER TABLE `silver_rates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

-- --------------------------------------------------------

--
-- Structure for view `user_gold_summary`
--
DROP TABLE IF EXISTS `user_gold_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`foodplus_gold`@`localhost` SQL SECURITY DEFINER VIEW `user_gold_summary`  AS SELECT `u`.`id` AS `user_id`, `u`.`name` AS `name`, `u`.`mobile` AS `mobile`, coalesce(sum(case when `t`.`type` = 'buy' and `t`.`status` = 'completed' and (`t`.`metal_type` = 'gold' or `t`.`metal_type` is null) then `t`.`gold_grams` else 0 end),0) - coalesce(sum(case when `t`.`type` in ('sell','delivery') and `t`.`status` = 'completed' and (`t`.`metal_type` = 'gold' or `t`.`metal_type` is null) then `t`.`gold_grams` else 0 end),0) AS `total_gold_grams`, coalesce(sum(case when `t`.`type` = 'buy' and `t`.`status` = 'completed' and (`t`.`metal_type` = 'gold' or `t`.`metal_type` is null) then `t`.`amount_inr` else 0 end),0) AS `total_invested_inr` FROM (`users` `u` left join `transactions` `t` on(`u`.`id` = `t`.`user_id`)) WHERE `u`.`is_admin` = 0 GROUP BY `u`.`id`, `u`.`name`, `u`.`mobile` ;

-- --------------------------------------------------------

--
-- Structure for view `user_summary`
--
DROP TABLE IF EXISTS `user_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`foodplus_gold`@`localhost` SQL SECURITY DEFINER VIEW `user_summary`  AS SELECT `u`.`id` AS `user_id`, `u`.`name` AS `name`, `u`.`mobile` AS `mobile`, `u`.`inr_wallet` AS `inr_wallet`, `u`.`silver_wallet` AS `silver_wallet`, `u`.`japsan_wallet` AS `japsan_wallet`, coalesce(sum(case when `t`.`type` = 'buy' and `t`.`status` = 'completed' and `t`.`metal_type` = 'gold' then `t`.`gold_grams` else 0 end),0) - coalesce(sum(case when `t`.`type` in ('sell','delivery') and `t`.`status` = 'completed' and `t`.`metal_type` = 'gold' then `t`.`gold_grams` else 0 end),0) AS `total_gold_grams`, coalesce(sum(case when `t`.`type` = 'buy' and `t`.`status` = 'completed' and `t`.`metal_type` = 'silver' then `t`.`gold_grams` else 0 end),0) - coalesce(sum(case when `t`.`type` in ('sell','delivery') and `t`.`status` = 'completed' and `t`.`metal_type` = 'silver' then `t`.`gold_grams` else 0 end),0) AS `total_silver_grams`, coalesce(sum(case when `t`.`type` = 'buy' and `t`.`status` = 'completed' then `t`.`amount_inr` else 0 end),0) AS `total_invested_inr` FROM (`users` `u` left join `transactions` `t` on(`u`.`id` = `t`.`user_id`)) WHERE `u`.`is_admin` = 0 GROUP BY `u`.`id`, `u`.`name`, `u`.`mobile`, `u`.`inr_wallet`, `u`.`silver_wallet`, `u`.`japsan_wallet` ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
