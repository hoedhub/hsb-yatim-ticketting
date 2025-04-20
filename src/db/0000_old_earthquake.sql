CREATE TABLE `customer_to_institution` (
	`customer_id` integer NOT NULL,
	`institution_id` integer NOT NULL,
	PRIMARY KEY(`customer_id`, `institution_id`),
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contact` text,
	`address` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `garment_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `garment_types_name_unique` ON `garment_types` (`name`);--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`pic_name` text,
	`contact` text,
	`address` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `measurement_details` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`set_id` integer NOT NULL,
	`point_id` integer NOT NULL,
	`value` real NOT NULL,
	`label` text,
	FOREIGN KEY (`set_id`) REFERENCES `measurement_sets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`point_id`) REFERENCES `measurement_points`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `measurement_points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`unit` text DEFAULT 'cm'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `measurement_points_name_unique` ON `measurement_points` (`name`);--> statement-breakpoint
CREATE TABLE `measurement_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` integer NOT NULL,
	`garment_type_id` integer NOT NULL,
	`label` text,
	`is_archived` integer DEFAULT false NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`garment_type_id`) REFERENCES `garment_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `measurement_set_customer_idx` ON `measurement_sets` (`customer_id`);--> statement-breakpoint
CREATE INDEX `measurement_set_active_idx` ON `measurement_sets` (`is_archived`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`customer_id` integer NOT NULL,
	`measurement_set_id` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`material` text,
	`color` text,
	`item_notes` text,
	`ticket_printed_at` integer,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`measurement_set_id`) REFERENCES `measurement_sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `order_item_order_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_item_customer_idx` ON `order_items` (`customer_id`);--> statement-breakpoint
CREATE TABLE `order_status_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`status` text NOT NULL,
	`changed_at` integer,
	`notes` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `order_history_order_idx` ON `order_status_history` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_number` text NOT NULL,
	`customer_id` integer,
	`institution_id` integer,
	`order_date` integer,
	`due_date` integer,
	`notes` text,
	`current_status` text DEFAULT 'Baru Masuk' NOT NULL,
	`is_paid` integer DEFAULT false NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `orders` (`current_status`);--> statement-breakpoint
CREATE INDEX `order_paid_idx` ON `orders` (`is_paid`);--> statement-breakpoint
CREATE TABLE `ticket_layouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`config` text NOT NULL,
	`is_default` integer DEFAULT false,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ticket_layouts_name_unique` ON `ticket_layouts` (`name`);