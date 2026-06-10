-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2026 at 05:55 PM
-- Server version: 8.0.42
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gold2`
--

-- --------------------------------------------------------

--
-- Table structure for table `delivery_requests`
--

CREATE TABLE `delivery_requests` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `transaction_id` int DEFAULT NULL,
  `gold_grams` decimal(10,4) NOT NULL,
  `delivery_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery_state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery_pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','processing','dispatched','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `tracking_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gold_rates`
--

CREATE TABLE `gold_rates` (
  `id` int NOT NULL,
  `rate_per_gram` decimal(10,2) NOT NULL,
  `rate_date` date NOT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gold_rates`
--

INSERT INTO `gold_rates` (`id`, `rate_per_gram`, `rate_date`, `updated_by`, `created_at`) VALUES
(1, 520000.00, '2026-05-06', 1, '2026-05-06 11:40:10'),
(4, 100.00, '2026-05-11', 1, '2026-05-11 03:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `lock_in_plans`
--

CREATE TABLE `lock_in_plans` (
  `id` int NOT NULL,
  `months` int NOT NULL,
  `return_percentage` decimal(5,2) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `plan_name` varchar(100) DEFAULT NULL,
  `min_investment` decimal(10,2) DEFAULT '0.00',
  `max_investment` decimal(10,2) DEFAULT '99999.00',
  `penalty_percentage` decimal(5,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lock_in_plans`
--

INSERT INTO `lock_in_plans` (`id`, `months`, `return_percentage`, `status`, `created_at`, `plan_name`, `min_investment`, `max_investment`, `penalty_percentage`) VALUES
(1, 6, 5.00, 'active', '2026-06-09 15:16:22', 'Silver Lock', 1.00, 999.00, 2.00),
(2, 12, 8.00, 'active', '2026-06-09 15:16:22', 'Gold Lock', 1.00, 999.00, 3.00),
(3, 24, 10.00, 'active', '2026-06-09 15:16:22', 'Premium Lock', 1.00, 999.00, 5.00),
(4, 36, 12.00, 'active', '2026-06-09 15:16:22', 'Diamond Lock', 1.00, 999.00, 8.00),
(5, 5, 10.00, 'active', '2026-06-10 15:17:09', 'test', 100.00, 100.00, 10.00);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('transaction','gold_rate','delivery','general') COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 2, 'Gold Rate Updated', 'Today\'s gold rate: ₹1000/gram', 'gold_rate', 0, '2026-05-06 12:39:42'),
(2, 2, 'Gold Rate Updated', 'Today\'s gold rate: ₹520000/gram', 'gold_rate', 0, '2026-05-06 12:40:13'),
(3, 2, 'Gold Rate Updated', 'Today\'s gold rate: ₹0.02/gram', 'gold_rate', 0, '2026-05-11 03:45:55'),
(4, 7, 'Gold Rate Updated', 'Today\'s gold rate: ₹0.02/gram', 'gold_rate', 0, '2026-05-11 03:45:55'),
(5, 2, 'Gold Rate Updated', 'Today\'s gold rate: ₹100.00/gram', 'gold_rate', 0, '2026-05-11 03:49:33'),
(6, 7, 'Gold Rate Updated', 'Today\'s gold rate: ₹100.00/gram', 'gold_rate', 0, '2026-05-11 03:49:33'),
(7, 2, 'Sell Request Submitted', 'Sell request for 10g (≈₹1000) is under review', 'transaction', 0, '2026-05-11 03:53:49'),
(8, 2, 'Transaction Updated', 'Your sell request for 10.0000g has been completed', 'transaction', 0, '2026-05-11 03:54:15'),
(9, 2, 'Gold Purchase Successful', 'You bought 1g gold for ₹100', 'transaction', 0, '2026-05-12 15:48:26'),
(10, 1, 'Gold Purchase Successful', 'You bought 58.88g gold for ₹5888', 'transaction', 0, '2026-05-13 11:09:34'),
(11, 2, 'Silver Purchase Successful', 'You bought 1.1765g silver for ₹100', 'transaction', 0, '2026-05-14 06:35:56'),
(12, 0, 'Silver Purchase Successful', 'You bought 5.8824g silver for ₹500', 'transaction', 0, '2026-05-14 09:10:29'),
(13, 2, 'Gold Purchase Successful', 'You bought 5g gold for ₹500', 'transaction', 0, '2026-06-10 14:49:24'),
(14, 2, 'Gold Purchase Successful', 'You bought 1g gold for ₹100', 'transaction', 0, '2026-06-10 15:01:50'),
(15, 2, 'Gold Purchase Successful', 'You bought 1g gold for ₹100', 'transaction', 0, '2026-06-10 15:15:04'),
(16, 2, 'Silver Sold Successful', 'You sold 0.0007g silver for ₹0.06', 'transaction', 0, '2026-06-10 15:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `silver_rates`
--

CREATE TABLE `silver_rates` (
  `id` int NOT NULL,
  `rate_per_gram` decimal(10,2) NOT NULL,
  `rate_date` date NOT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `silver_rates`
--

INSERT INTO `silver_rates` (`id`, `rate_per_gram`, `rate_date`, `updated_by`, `created_at`) VALUES
(1, 85.00, '2026-05-14', NULL, '2026-05-14 06:23:50'),
(2, 85.00, '2026-05-17', NULL, '2026-05-17 03:18:59'),
(3, 85.00, '2026-05-18', NULL, '2026-05-18 03:39:21'),
(4, 85.00, '2026-06-07', NULL, '2026-06-07 14:52:41');

-- --------------------------------------------------------

--
-- Table structure for table `sip_plans`
--

CREATE TABLE `sip_plans` (
  `id` int NOT NULL,
  `plan_name` varchar(100) DEFAULT NULL,
  `min_amount` decimal(10,2) DEFAULT '0.00',
  `max_amount` decimal(10,2) DEFAULT '999999.00',
  `frequency` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sip_plans`
--

INSERT INTO `sip_plans` (`id`, `plan_name`, `min_amount`, `max_amount`, `frequency`, `status`, `created_at`) VALUES
(1, 'Basic SIP', 500.00, 999999.00, 'monthly', 'active', '2026-06-09 15:25:02'),
(2, 'Gold SIP', 1000.00, 999999.00, 'monthly', 'active', '2026-06-09 15:25:02'),
(3, 'Premium SIP', 5000.00, 999999.00, 'monthly', 'active', '2026-06-09 15:25:02');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `subject` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `status` enum('open','pending','closed') COLLATE utf8mb3_unicode_ci DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `user_id`, `subject`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 0, 'Balance issue ', '1000 balance not added my profile ', 'closed', '2026-05-14 09:19:02', '2026-05-14 09:30:13');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('delivery_charge', '150', '2026-06-07 16:21:25'),
('forwarding_charge', '100', '2026-06-07 16:21:25'),
('package_charge', '50', '2026-06-07 16:21:25'),
('sip_penalty_charge', '50', '2026-06-07 16:21:25');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` enum('buy','sell','delivery','deposit','withdraw','sip','referral') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount_inr` decimal(12,2) DEFAULT NULL,
  `gold_grams` decimal(10,4) DEFAULT NULL,
  `gold_rate` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','completed','rejected','processing') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `metal_type` enum('gold','silver') COLLATE utf8mb4_unicode_ci DEFAULT 'gold',
  `transaction_source` enum('direct','sip','referral','wallet') COLLATE utf8mb4_unicode_ci DEFAULT 'direct'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `type`, `amount_inr`, `gold_grams`, `gold_rate`, `status`, `payment_method`, `payment_id`, `notes`, `created_by`, `created_at`, `updated_at`, `metal_type`, `transaction_source`) VALUES
(3, 1, 'delivery', 100.00, 10.0000, 100.00, 'completed', 'manual', NULL, 'trs', 1, '2026-05-11 03:50:13', '2026-05-11 03:50:13', 'gold', 'direct'),
(4, 2, 'buy', 1000.00, 10.0000, 100.00, 'completed', 'manual', NULL, '10', 1, '2026-05-11 03:51:22', '2026-05-11 03:51:22', 'gold', 'direct'),
(5, 2, 'sell', 1000.00, 10.0000, 100.00, 'completed', NULL, NULL, '', NULL, '2026-05-11 03:53:49', '2026-05-11 03:54:15', 'gold', 'direct'),
(6, 2, 'buy', 100.00, 1.0000, 100.00, 'completed', 'UPI', 'MOCK_TXN_1778600905457', NULL, NULL, '2026-05-12 15:48:26', '2026-05-12 15:48:26', 'gold', 'direct'),
(7, 1, 'buy', 5888.00, 58.8800, 100.00, 'completed', 'UPI', 'MOCK_TXN_1778670572507', NULL, NULL, '2026-05-13 11:09:34', '2026-05-13 11:09:34', 'gold', 'direct'),
(8, 2, '', 100.00, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, '2026-05-14 06:27:49', '2026-05-14 06:27:49', 'gold', 'wallet'),
(9, 2, 'buy', 100.00, 1.1765, 85.00, 'completed', 'UPI', NULL, NULL, NULL, '2026-05-14 06:35:56', '2026-05-14 06:35:56', 'silver', 'direct'),
(10, 0, '', 1000.00, NULL, NULL, 'completed', NULL, NULL, NULL, NULL, '2026-05-14 09:09:36', '2026-05-14 09:09:36', 'gold', 'wallet'),
(11, 0, 'buy', 1000.00, 10.0000, 100.00, 'completed', NULL, NULL, 'Auto SIP conversion', NULL, '2026-05-14 09:09:36', '2026-05-14 09:09:36', 'gold', 'wallet'),
(12, 0, 'buy', 500.00, 5.8824, 85.00, 'completed', 'UPI', NULL, NULL, NULL, '2026-05-14 09:10:29', '2026-05-14 09:10:29', 'silver', 'direct'),
(16, 2, 'deposit', 100.00, NULL, NULL, 'completed', NULL, NULL, 'INR Deposit', NULL, '2026-05-17 03:34:53', '2026-05-17 03:34:53', 'gold', 'wallet'),
(17, 2, 'buy', 10.00, 0.1000, 100.00, 'completed', NULL, NULL, 'Daily SIP Deduction', NULL, '2026-05-17 03:35:56', '2026-05-17 03:35:56', 'gold', 'sip'),
(18, 2, 'buy', 10.00, 0.1000, 100.00, 'completed', NULL, NULL, 'Daily SIP Deduction', NULL, '2026-05-18 03:40:29', '2026-05-18 03:40:29', 'gold', 'sip'),
(19, 2, 'buy', 500.00, 5.8824, 85.00, 'completed', 'UPI', NULL, NULL, NULL, '2026-06-10 14:23:44', '2026-06-10 14:23:44', 'silver', 'direct'),
(20, 2, 'buy', 500.00, 5.8824, 85.00, 'completed', 'UPI', NULL, NULL, NULL, '2026-06-10 14:25:06', '2026-06-10 14:25:06', 'silver', 'direct'),
(21, 2, 'buy', 500.00, 5.8824, 85.00, 'completed', 'UPI', NULL, NULL, NULL, '2026-06-10 14:25:14', '2026-06-10 14:25:14', 'silver', 'direct'),
(22, 2, 'buy', 500.00, 5.8824, 85.00, 'completed', 'UPI', NULL, NULL, NULL, '2026-06-10 14:27:28', '2026-06-10 14:27:28', 'silver', 'direct'),
(23, 2, 'buy', 500.00, 5.8824, 85.00, 'completed', 'UPI', NULL, NULL, NULL, '2026-06-10 14:27:41', '2026-06-10 14:27:41', 'silver', 'direct'),
(24, 2, 'sell', 500.00, 5.8824, 85.00, 'completed', 'wallet', NULL, 'Sold to buy Gold', NULL, '2026-06-10 14:49:24', '2026-06-10 14:49:24', 'silver', 'direct'),
(25, 2, 'buy', 500.00, 5.0000, 100.00, 'completed', 'silver_wallet', 'WALLET_TXN', NULL, NULL, '2026-06-10 14:49:24', '2026-06-10 14:49:24', 'gold', 'direct'),
(26, 2, 'buy', 100.00, 1.0000, 100.00, 'completed', 'inr_wallet', 'WALLET_TXN', NULL, NULL, '2026-06-10 15:01:50', '2026-06-10 15:01:50', 'gold', 'direct'),
(27, 2, 'sell', 0.00, 4.0000, NULL, 'completed', NULL, NULL, 'Locked 4 g for 12 months', NULL, '2026-06-10 15:10:55', '2026-06-10 15:10:55', 'gold', 'direct'),
(28, 2, 'buy', 100.00, 1.0000, 100.00, 'completed', 'inr_wallet', 'WALLET_TXN', NULL, NULL, '2026-06-10 15:15:04', '2026-06-10 15:15:04', 'gold', 'direct'),
(29, 2, 'sell', 0.00, 2.0000, NULL, 'completed', NULL, NULL, 'Locked 2 g for 6 months', NULL, '2026-06-10 15:15:14', '2026-06-10 15:15:14', 'gold', 'direct'),
(30, 2, 'sell', 0.06, 0.0007, 85.00, 'completed', NULL, NULL, NULL, NULL, '2026-06-10 15:35:07', '2026-06-10 15:35:07', 'silver', 'direct');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aadhar_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pan_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_admin` tinyint(1) DEFAULT '0',
  `otp` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `inr_wallet` decimal(12,2) DEFAULT '0.00',
  `silver_wallet` decimal(10,4) DEFAULT '0.0000',
  `sip_active` tinyint(1) DEFAULT '0',
  `sip_amount` decimal(10,2) DEFAULT '0.00',
  `sip_frequency` enum('daily','monthly') COLLATE utf8mb4_unicode_ci DEFAULT 'monthly',
  `sip_last_deducted` datetime DEFAULT NULL,
  `referred_by` int DEFAULT NULL,
  `japsan_wallet` decimal(12,2) DEFAULT '0.00',
  `fcm_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `mobile`, `email`, `address`, `city`, `state`, `pincode`, `aadhar_number`, `pan_number`, `profile_photo`, `is_active`, `is_admin`, `otp`, `otp_expires_at`, `created_at`, `updated_at`, `inr_wallet`, `silver_wallet`, `sip_active`, `sip_amount`, `sip_frequency`, `sip_last_deducted`, `referred_by`, `japsan_wallet`, `fcm_token`) VALUES
(1, 'Admin', '9999999999', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '123456', '2026-05-17 05:40:20', '2026-05-06 11:40:10', '2026-05-17 03:35:20', 0.00, 0.0000, 0, 0.00, 'monthly', NULL, NULL, 0.00, NULL),
(2, 'Koushik ghosh', '6296488643', '', 'belun', 'kolkata', 'West Bengal', '', '', '', NULL, 1, 0, '123456', '2026-06-10 17:04:14', '2026-05-06 12:18:31', '2026-06-10 15:15:04', 400.00, 0.0000, 1, 10.00, 'daily', '2026-05-18 09:10:29', NULL, 0.00, NULL),
(7, 'Koushik ghosh', '6296488644', 'kg@gmail.com', 'belun', 'kolkata', 'West Bengal', '713140', '202020202020', 'ABCDE1234F', NULL, 1, 0, '123456', '2026-05-11 05:48:20', '2026-05-11 03:43:00', '2026-05-11 03:43:20', 0.00, 0.0000, 0, 0.00, 'monthly', NULL, NULL, 0.00, NULL),
(0, 'Provat mondal', '9647457831', 'gulludas990@gmail.com', 'Kolkata', 'Kolkata', 'West Bengal', '700001', '000088889999', 'Fuxth5823d', NULL, 1, 0, '123456', '2026-05-14 06:59:30', '2026-05-13 11:10:33', '2026-05-14 09:14:44', 0.00, 0.0000, 1, 100.00, 'daily', NULL, NULL, 0.00, NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_gold_summary`
-- (See below for the actual view)
--
CREATE TABLE `user_gold_summary` (
`mobile` varchar(15)
,`name` varchar(100)
,`total_gold_grams` decimal(33,4)
,`total_invested_inr` decimal(34,2)
,`user_id` int
);

-- --------------------------------------------------------

--
-- Table structure for table `user_lock_ins`
--

CREATE TABLE `user_lock_ins` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `gold_grams` decimal(10,4) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('active','completed','early_unlock') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_lock_ins`
--

INSERT INTO `user_lock_ins` (`id`, `user_id`, `plan_id`, `gold_grams`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(5, 2, 2, 4.0000, '2026-06-10 20:40:55', '2027-06-10 17:10:55', 'active', '2026-06-10 15:10:55'),
(6, 2, 1, 2.0000, '2026-06-10 20:45:14', '2026-12-10 17:15:14', 'active', '2026-06-10 15:15:14');

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_summary`
-- (See below for the actual view)
--
CREATE TABLE `user_summary` (
`inr_wallet` decimal(12,2)
,`japsan_wallet` decimal(12,2)
,`mobile` varchar(15)
,`name` varchar(100)
,`silver_wallet` decimal(10,4)
,`total_gold_grams` decimal(33,4)
,`total_invested_inr` decimal(34,2)
,`total_silver_grams` decimal(33,4)
,`user_id` int
);

-- --------------------------------------------------------

--
-- Structure for view `user_gold_summary`
--
DROP TABLE IF EXISTS `user_gold_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_gold_summary`  AS SELECT `u`.`id` AS `user_id`, `u`.`name` AS `name`, `u`.`mobile` AS `mobile`, (coalesce(sum((case when ((`t`.`type` = 'buy') and (`t`.`status` = 'completed') and ((`t`.`metal_type` = 'gold') or (`t`.`metal_type` is null))) then `t`.`gold_grams` else 0 end)),0) - coalesce(sum((case when ((`t`.`type` in ('sell','delivery')) and (`t`.`status` = 'completed') and ((`t`.`metal_type` = 'gold') or (`t`.`metal_type` is null))) then `t`.`gold_grams` else 0 end)),0)) AS `total_gold_grams`, coalesce(sum((case when ((`t`.`type` = 'buy') and (`t`.`status` = 'completed') and ((`t`.`metal_type` = 'gold') or (`t`.`metal_type` is null))) then `t`.`amount_inr` else 0 end)),0) AS `total_invested_inr` FROM (`users` `u` left join `transactions` `t` on((`u`.`id` = `t`.`user_id`))) WHERE (`u`.`is_admin` = 0) GROUP BY `u`.`id`, `u`.`name`, `u`.`mobile` ;

-- --------------------------------------------------------

--
-- Structure for view `user_summary`
--
DROP TABLE IF EXISTS `user_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_summary`  AS SELECT `u`.`id` AS `user_id`, `u`.`name` AS `name`, `u`.`mobile` AS `mobile`, `u`.`inr_wallet` AS `inr_wallet`, `u`.`silver_wallet` AS `silver_wallet`, `u`.`japsan_wallet` AS `japsan_wallet`, (coalesce(sum((case when ((`t`.`type` = 'buy') and (`t`.`status` = 'completed') and (`t`.`metal_type` = 'gold')) then `t`.`gold_grams` else 0 end)),0) - coalesce(sum((case when ((`t`.`type` in ('sell','delivery')) and (`t`.`status` = 'completed') and (`t`.`metal_type` = 'gold')) then `t`.`gold_grams` else 0 end)),0)) AS `total_gold_grams`, (coalesce(sum((case when ((`t`.`type` = 'buy') and (`t`.`status` = 'completed') and (`t`.`metal_type` = 'silver')) then `t`.`gold_grams` else 0 end)),0) - coalesce(sum((case when ((`t`.`type` in ('sell','delivery')) and (`t`.`status` = 'completed') and (`t`.`metal_type` = 'silver')) then `t`.`gold_grams` else 0 end)),0)) AS `total_silver_grams`, coalesce(sum((case when ((`t`.`type` = 'buy') and (`t`.`status` = 'completed')) then `t`.`amount_inr` else 0 end)),0) AS `total_invested_inr` FROM (`users` `u` left join `transactions` `t` on((`u`.`id` = `t`.`user_id`))) WHERE (`u`.`is_admin` = 0) GROUP BY `u`.`id`, `u`.`name`, `u`.`mobile`, `u`.`inr_wallet`, `u`.`silver_wallet`, `u`.`japsan_wallet` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lock_in_plans`
--
ALTER TABLE `lock_in_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `silver_rates`
--
ALTER TABLE `silver_rates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rate_date` (`rate_date`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `sip_plans`
--
ALTER TABLE `sip_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_lock_ins`
--
ALTER TABLE `user_lock_ins`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lock_in_plans`
--
ALTER TABLE `lock_in_plans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `silver_rates`
--
ALTER TABLE `silver_rates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sip_plans`
--
ALTER TABLE `sip_plans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user_lock_ins`
--
ALTER TABLE `user_lock_ins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
