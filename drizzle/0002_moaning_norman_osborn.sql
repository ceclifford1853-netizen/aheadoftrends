ALTER TABLE `leads` ADD `score` varchar(16);--> statement-breakpoint
ALTER TABLE `leads` ADD `status` varchar(32) DEFAULT 'pending';