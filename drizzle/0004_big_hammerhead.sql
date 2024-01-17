CREATE TABLE `follows` (
	`follower` text NOT NULL,
	`followed` text NOT NULL,
	FOREIGN KEY (`follower`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`followed`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `follower_followed` ON `follows` (`follower`,`followed`);