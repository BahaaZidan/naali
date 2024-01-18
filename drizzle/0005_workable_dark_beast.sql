CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`type` text DEFAULT 'video',
	`caption` text,
	`creator` text NOT NULL,
	`video_id` text NOT NULL,
	FOREIGN KEY (`creator`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE cascade
);
