CREATE SCHEMA IF NOT EXISTS `INSTADB` DEFAULT CHARACTER SET utf8 ;
USE `INSTADB` ;

-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE users (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(192) NOT NULL,
  `email` VARCHAR(192)  UNIQUE NOT NULL,
  `username` VARCHAR(45) UNIQUE NOT NULL,
  `password` VARCHAR(192) NOT NULL,
  `avatar` VARCHAR(192),
  `created_at` DATETIME,
  `updated_at` DATETIME
  );


-- -----------------------------------------------------
-- Table `mydb`.`posts`
-- -----------------------------------------------------
CREATE TABLE posts(
  `id` VARCHAR(200) NOT NULL UNIQUE PRIMARY KEY,
  `like` INT,
  `created_at`DATETIME,
  `updated_at` DATETIME,
  `users_id` INT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users (id)
    );


-- -----------------------------------------------------
-- Table `mydb`.`images`
-- -----------------------------------------------------
CREATE TABLE images(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image` VARCHAR(192),
  `posts_id` VARCHAR(200) NOT NULL,
    FOREIGN KEY (posts_id) REFERENCES posts (id)
    );


-- -----------------------------------------------------
-- Table `mydb`.`likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `INSTADB`.`likes` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `created_at` DATETIME,
  `posts_id` VARCHAR(200) NOT NULL,
  FOREIGN KEY (posts_id) REFERENCES posts (id),
  `users_id` INT NOT NULL,
  FOREIGN KEY (users_id) REFERENCES users (id)
  );

