-- 1. Create Lock-In Plans Table
CREATE TABLE IF NOT EXISTS `lock_in_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `months` int NOT NULL,
  `return_percentage` decimal(5,2) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `plan_name` varchar(100) DEFAULT NULL,
  `min_investment` decimal(10,2) DEFAULT '0.00',
  `max_investment` decimal(10,2) DEFAULT '99999.00',
  `penalty_percentage` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Create SIP Plans Table
CREATE TABLE IF NOT EXISTS `sip_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(100) DEFAULT NULL,
  `min_amount` decimal(10,2) DEFAULT '0.00',
  `max_amount` decimal(10,2) DEFAULT '999999.00',
  `frequency` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Create System Settings Table
CREATE TABLE IF NOT EXISTS `system_settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Create User Lock-ins Table
CREATE TABLE IF NOT EXISTS `user_lock_ins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `gold_grams` decimal(10,4) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('active','completed','early_unlock') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Fix AUTO_INCREMENT and Duplicate ID 0 in existing tables
SET @ncount = 0;
UPDATE `notifications` SET `id` = (@ncount:=@ncount+1);
ALTER TABLE `notifications` ADD PRIMARY KEY (`id`);
ALTER TABLE `notifications` MODIFY `id` int NOT NULL AUTO_INCREMENT;

SET @tcount = 0;
UPDATE `transactions` SET `id` = (@tcount:=@tcount+1);
ALTER TABLE `transactions` ADD PRIMARY KEY (`id`);
ALTER TABLE `transactions` MODIFY `id` int NOT NULL AUTO_INCREMENT;

-- 6. Insert Default Data (Only if empty)
INSERT IGNORE INTO `system_settings` (`setting_key`, `setting_value`) VALUES
('sip_penalty_charge', '50.00');

INSERT IGNORE INTO `sip_plans` (`id`, `plan_name`, `min_amount`, `max_amount`, `frequency`, `status`) VALUES
(1, 'Daily Mini Savings', '10.00', '5000.00', 'daily', 'active'),
(2, 'Monthly Gold SIP', '500.00', '50000.00', 'monthly', 'active'),
(3, 'Premium Monthly SIP', '5000.00', '200000.00', 'monthly', 'active');

INSERT IGNORE INTO `lock_in_plans` (`id`, `months`, `return_percentage`, `plan_name`, `min_investment`, `max_investment`, `penalty_percentage`) VALUES
(1, 6, '2.50', '6 Months Starter Plan', '1.00', '50.00', '1.00'),
(2, 12, '6.00', '1 Year Growth Plan', '2.00', '100.00', '2.00'),
(3, 24, '13.50', '2 Years Wealth Plan', '5.00', '500.00', '3.00');

-- 7. Create User Gold Summary View
DROP VIEW IF EXISTS `user_gold_summary`;
CREATE VIEW `user_gold_summary` AS 
SELECT 
    `u`.`id` AS `user_id`, 
    `u`.`name` AS `name`, 
    `u`.`mobile` AS `mobile`, 
    (coalesce(sum((case when ((`t`.`type` = 'buy') and (`t`.`status` = 'completed') and ((`t`.`metal_type` = 'gold') or (`t`.`metal_type` is null))) then `t`.`gold_grams` else 0 end)),0) - coalesce(sum((case when ((`t`.`type` in ('sell','delivery')) and (`t`.`status` = 'completed') and ((`t`.`metal_type` = 'gold') or (`t`.`metal_type` is null))) then `t`.`gold_grams` else 0 end)),0)) AS `total_gold_grams`, 
    coalesce(sum((case when ((`t`.`type` = 'buy') and (`t`.`status` = 'completed') and ((`t`.`metal_type` = 'gold') or (`t`.`metal_type` is null))) then `t`.`amount_inr` else 0 end)),0) AS `total_invested_inr` 
FROM (`users` `u` left join `transactions` `t` on((`u`.`id` = `t`.`user_id`))) 
WHERE (`u`.`is_admin` = 0) 
GROUP BY `u`.`id`, `u`.`name`, `u`.`mobile`;
