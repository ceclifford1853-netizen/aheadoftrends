CREATE TABLE `aeoScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`websiteUrl` varchar(2048) NOT NULL,
	`qualityScore` int NOT NULL,
	`seoScore` int NOT NULL,
	`authorityScore` int NOT NULL,
	`visibilityScore` int NOT NULL,
	`overallScore` int NOT NULL,
	`recommendations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aeoScores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`websiteUrl` varchar(2048) NOT NULL,
	`industry` varchar(256),
	`companyName` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
