CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `email` varchar(255) UNIQUE,
  `password` varchar(255),
  `stripe_account_id` varchar(255) COMMENT 'Publisher Stripe Connect ID for payouts',
  `role` varchar(255) COMMENT 'admin, publisher, retailer (managed via Spatie roles)',
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `publisher_profiles` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int UNIQUE,
  `company_name` varchar(255),
  `payout_email` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `retailer_profiles` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int UNIQUE,
  `store_name` varchar(255),
  `location` varchar(255),
  `aesthetic_tags` text,
  `website` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `retailer_addresses` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `retailer_id` int,
  `type` varchar(255) COMMENT 'billing, shipping',
  `address_line1` varchar(255),
  `address_line2` varchar(255),
  `city` varchar(255),
  `state` varchar(255),
  `country` varchar(255),
  `postal_code` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `retailer_stores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `retailer_id` int,
  `platform` varchar(255) COMMENT 'shopify, woocommerce, custom',
  `store_name` varchar(255),
  `store_url` varchar(255),
  `access_token` varchar(255) COMMENT 'OAuth token for API access',
  `status` varchar(255) COMMENT 'active, inactive, revoked',
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `magazines` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `publisher_id` int,
  `title_name` varchar(255),
  `issue_identifier` varchar(255) COMMENT 'Issue number or name',
  `cover_image` varchar(255),
  `genre` varchar(255),
  `description` text,
  `dimensions` varchar(255),
  `page_count` int,
  `stock` int,
  `wholesale_price` decimal,
  `msrp` decimal,
  `return_policy` varchar(255) COMMENT 'guaranteed, final_sale',
  `retailer_fit_tags` text,
  `status` varchar(255) COMMENT 'pending, approved, rejected (admin moderated)',
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `orders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `retailer_id` int,
  `publisher_id` int,
  `retailer_store_id` int COMMENT 'If synced from Shopify',
  `status` varchar(255) COMMENT 'submitted, in_transit, delivered, returned, refunded (admin override possible)',
  `subtotal` decimal,
  `commission_fee` decimal,
  `external_order_id` varchar(255) COMMENT 'Shopify/Woo order id if applicable',
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `order_items` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int,
  `magazine_id` int,
  `quantity` int,
  `unit_price` decimal,
  `return_eligible` boolean
);

CREATE TABLE `shipments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int,
  `order_item_id` int COMMENT 'Optional if shipment is item-specific',
  `leg` varchar(255) COMMENT 'publisher_to_admin, admin_to_retailer, retailer_to_admin, admin_to_publisher',
  `tracking_number` varchar(255),
  `carrier` varchar(255),
  `status` varchar(255) COMMENT 'pending, in_transit, delivered (admin can override)',
  `shipped_at` timestamp,
  `delivered_at` timestamp
);

CREATE TABLE `returns` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int,
  `status` varchar(255) COMMENT 'awaiting, received, refunded, partially_refunded',
  `reason` text,
  `tracking_number` varchar(255),
  `received_at` timestamp,
  `refunded_at` timestamp,
  `notes` text,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `return_items` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `return_id` int,
  `order_item_id` int,
  `quantity` int,
  `refund_amount` decimal,
  `status` varchar(255) COMMENT 'pending, approved, rejected, refunded'
);

CREATE TABLE `payouts` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `publisher_id` int,
  `amount` decimal,
  `status` varchar(255) COMMENT 'scheduled, paid, deducted',
  `payout_date` date,
  `created_at` timestamp
);

CREATE TABLE `store_orders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `retailer_store_id` int,
  `external_order_id` varchar(255),
  `raw_payload` json,
  `status` varchar(255) COMMENT 'imported, processed, failed',
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `payments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int,
  `stripe_payment_intent_id` varchar(255) COMMENT 'Stripe reference',
  `amount` decimal,
  `currency` varchar(255),
  `status` varchar(255) COMMENT 'pending, succeeded, refunded, failed',
  `created_at` timestamp,
  `updated_at` timestamp
);

ALTER TABLE `publisher_profiles` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `retailer_profiles` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `retailer_addresses` ADD FOREIGN KEY (`retailer_id`) REFERENCES `retailer_profiles` (`id`);

ALTER TABLE `retailer_stores` ADD FOREIGN KEY (`retailer_id`) REFERENCES `retailer_profiles` (`id`);

ALTER TABLE `magazines` ADD FOREIGN KEY (`publisher_id`) REFERENCES `publisher_profiles` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`retailer_id`) REFERENCES `retailer_profiles` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`publisher_id`) REFERENCES `publisher_profiles` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`retailer_store_id`) REFERENCES `retailer_stores` (`id`);

ALTER TABLE `order_items` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

ALTER TABLE `order_items` ADD FOREIGN KEY (`magazine_id`) REFERENCES `magazines` (`id`);

ALTER TABLE `shipments` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

ALTER TABLE `shipments` ADD FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`);

ALTER TABLE `returns` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

ALTER TABLE `return_items` ADD FOREIGN KEY (`return_id`) REFERENCES `returns` (`id`);

ALTER TABLE `return_items` ADD FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`);

ALTER TABLE `payouts` ADD FOREIGN KEY (`publisher_id`) REFERENCES `publisher_profiles` (`id`);

ALTER TABLE `store_orders` ADD FOREIGN KEY (`retailer_store_id`) REFERENCES `retailer_stores` (`id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
