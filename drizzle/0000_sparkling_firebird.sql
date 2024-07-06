CREATE TABLE IF NOT EXISTS "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"phone" varchar(256),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
