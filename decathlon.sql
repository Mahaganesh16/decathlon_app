ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Shreetech@123';
FLUSH PRIVILEGES;


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'shreetech@123';

ALTER USER 'root'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'shreetech@123';


CREATE USER 'root'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'shreetech@123';

GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;

FLUSH PRIVILEGES;

CREATE DATABASE decathlon;



-- 1. Explicitly target your custom decathlon database instance
CREATE DATABASE IF NOT EXISTS `decathlon`;
USE `decathlon`;

-- 2. Clean up structural properties if re-running
DROP TABLE IF EXISTS `AlertBanner`;
DROP TABLE IF EXISTS `Coupon`;
DROP TABLE IF EXISTS `QuickLink`;
DROP TABLE IF EXISTS `Product`;

-- 3. Create structural models matching the visual UI layout frames
CREATE TABLE `AlertBanner` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `text` VARCHAR(255) NOT NULL,
    `linkText` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL
);

CREATE TABLE `Coupon` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL,
    `discount` VARCHAR(50) NOT NULL,
    `minPurchase` VARCHAR(50) NOT NULL,
    `bgColor` VARCHAR(50) NOT NULL
);

CREATE TABLE `QuickLink` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `imageUrl` VARCHAR(255) NOT NULL
);

CREATE TABLE `Product` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `brand` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `imageUrl` VARCHAR(255) NOT NULL,
    `rating` DECIMAL(3,1) NOT NULL,
    `reviews` VARCHAR(50) NOT NULL,
    `price` INT NOT NULL,
    `mrp` INT NOT NULL,
    `discountTag` VARCHAR(100) NULL,
    `category` VARCHAR(100) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED DATA - EXACT MATCH FOR THE VISUAL MOCKUP
-- ==========================================

INSERT INTO `AlertBanner` (`text`, `linkText`, `email`) VALUES
('Notice! | Product Recall | Horse Riding Helmet 100 Fouganza | Contact us! on customer care: 7676798989 or ', 'care.india@decathlon.com', 'care.india@decathlon.com');

INSERT INTO `Coupon` (`code`, `discount`, `minPurchase`, `bgColor`) VALUES
('NC100', '₹100 OFF', 'above ₹1499', 'bg-blue-600'),
('NC200', '₹200 OFF', 'above ₹2499', 'bg-blue-700'),
('NC300', '₹300 OFF', 'above ₹3499', 'bg-blue-800');

INSERT INTO `QuickLink` (`title`, `imageUrl`) VALUES
('Monsoon Essentials', 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=300'),
('Activewear', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300'),
('Fitness Equipments', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=300'),
('Cycling', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=300'),
('Hiking & Trekking', 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=300'),
('Shoes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300'),
('Bag & Backpacks', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300'),
('Sports Accessories', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=300');

INSERT INTO `Product` (`brand`, `name`, `imageUrl`, `rating`, `reviews`, `price`, `mrp`, `discountTag`, `category`) VALUES
('DECATHLON', 'Umbrella Unisex ProFilter Small Eco-Friendly', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=400', 4.3, '4.3k', 799, 1299, 'Price drop', 'Storm Proof.'),
('INESIS', 'Umbrella Unisex MICROPLUS Lightweight', 'https://images.unsplash.com/photo-1527786356703-4b100083cd2c?q=80&w=400', 4.2, '127', 699, 949, NULL, 'Storm Proof.'),
('INESIS', 'Umbrella Unisex ProFilter Medium Eco-Friendly Red', 'https://images.unsplash.com/photo-1565626424175-c7ff88275952?q=80&w=400', 4.6, '2.9k', 699, 1499, '53% off', 'Storm Proof.'),
('INESIS', 'Umbrella Unisex ProFilter Medium Eco-Friendly Black', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=400', 4.6, '2.9k', 999, 1499, 'Buy 2 @ ₹1899 & Save ₹99 off', 'Storm Proof.'),
('QUECHUA', 'Rain Poncho Unisex Hiking Lightweight Waterproof', 'https://images.unsplash.com/photo-1620743134151-240e8b28a96f?q=80&w=400', 4.7, '4.2k', 799, 1499, NULL, 'Storm Proof.'),
('DOMYOS', 'Men Gym Trackpant Convertible, Jog Fit, Quick Dry', 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=400', 4.4, '8.1k', 999, 999, 'Buy 3 @ 2847 and Save 150', 'Shop your Workout Checklist'),
('DOMYOS', 'Men Fitness Tracksuit Jacket with Moisture Wicking', 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=400', 4.5, '4.5k', 999, 1699, NULL, 'Shop your Workout Checklist'),
('DOMYOS', 'Men Gym Shorts, Stretchable, Quick Dry and Light', 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=400', 4.3, '17.2k', 399, 699, NULL, 'Shop your Workout Checklist'),
('DOMYOS', 'Men Gym Trackpants Slim Fit Jogger Style Breathable', 'https://images.unsplash.com/photo-1517438322307-e67111335449?q=80&w=400', 4.1, '5.1k', 899, 1699, NULL, 'Shop your Workout Checklist'),
('DECATHLON', 'Men Walking EVA Sole, Lightweight and Ergonomic', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', 4.5, '2.5k', 2299, 2299, NULL, 'Shop your Workout Checklist');




USE `decathlon`;

-- 1. Create the new Hero Banner schema table
CREATE TABLE IF NOT EXISTS `HeroBanner` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` VARCHAR(255) NOT NULL,
    `priceTag` VARCHAR(100) NOT NULL,
    `imageUrl` VARCHAR(550) NOT NULL,
    `buttonLink` VARCHAR(255) DEFAULT '/'
);

-- 2. Populate the slides exactly as shown in your layout snapshots
INSERT INTO `HeroBanner` (`title`, `subtitle`, `priceTag`, `imageUrl`, `buttonLink`) VALUES
('Rain On. Kick Off.', 'Shop Football Balls', '₹129 onwards', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1400', '/sports/football'),
('Monsoon Gear Ready', 'Explore Elite Rain Ponchos', '₹799 onwards', 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1400', '/collection/monsoon'),
('Elevate Your Workout Checklist', 'Premium Gym Apparel & Equipment', '₹399 onwards', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1400', '/collection/fitness');



UPDATE HeroBanner
SET
title='Rain On. Kick Off.',
subtitle='Shop Football Balls',
priceTag='₹129 onwards',
imageUrl='https://unsplash.com/photos/men-playing-soccer-on-green-grass-field-during-daytime-HsnNrraOYd4',
buttonLink='/sports/football'
WHERE id=1;

UPDATE HeroBanner
SET
title='Monsoon Gear Ready',
subtitle='Explore Elite Rain Ponchos',
priceTag='₹799 onwards',
imageUrl='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
buttonLink='/collection/monsoon'
WHERE id=2;

UPDATE HeroBanner
SET
title='Elevate Your Workout Checklist',
subtitle='Premium Gym Apparel & Equipment',
priceTag='₹399 onwards',
imageUrl='https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
buttonLink='/collection/fitness'
WHERE id=3;


USE `decathlon`;

-- Fix Slide 1: Swapping the standard webpage URL for a verified direct image stream asset link
UPDATE `HeroBanner`
SET
  `title`='Rain On. Kick Off.',
  `subtitle`='Shop Football Balls',
  `priceTag`='₹129 onwards',
  `imageUrl`='https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1600',
  `buttonLink`='/sports/football'
WHERE `id`=1;

-- Fix Slide 2: Enhancing the Rain Poncho collection backdrop image
UPDATE `HeroBanner`
SET
  `title`='Monsoon Gear Ready',
  `subtitle`='Explore Elite Rain Ponchos',
  `priceTag`='₹799 onwards',
  `imageUrl`='https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1600',
  `buttonLink`='/collection/monsoon'
WHERE `id`=2;

-- Fix Slide 3: Enhancing the Workout checklist backdrop image
UPDATE `HeroBanner`
SET
  `title`='Elevate Your Workout Checklist',
  `subtitle`='Premium Gym Apparel & Equipment',
  `priceTag`='₹399 onwards',
  `imageUrl`='https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600',
  `buttonLink`='/collection/fitness'
WHERE `id`=3;

-- Verify your rows match correctly
SELECT * FROM `HeroBanner`;


-- 1. Point explicitly to your system workspace
USE mysql;

-- 2. Force reset both connection routing records using native credentials configurations
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'shreetech@123';
ALTER USER 'root'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'shreetech@123';

-- 3. Clear engine caches and exit safely
FLUSH PRIVILEGES;
-- 1. Point explicitly to your system workspace
USE mysql;

-- 2. Force reset both connection routing records using native credentials configurations
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'shreetech@123';
ALTER USER 'root'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'shreetech@123';

-- 3. Clear engine caches and exit safely
FLUSH PRIVILEGES;




USE `decathlon`;

-- Item 1: DECATHLON Umbrella Unisex ProFilter Small Eco-Friendly
UPDATE `Product`
SET 
  `brand` = 'DECATHLON',
  `name` = 'Umbrella Unisex ProFilter Small Eco-Friendly',
  `price` = 799,
  `mrp` = 1299,
  `discountTag` = 'PRICE DROP',
  `imageUrl` = 'https://media.istockphoto.com/id/1852243832/photo/umbrella-and-city-lights-at-night.jpg?s=2048x2048&w=is&k=20&c=k3WlVdwmwS1QscMhE-tKqB86oeg7kyG2AEHIbGY2lss=',
  `category` = 'STORM PROOF.'
WHERE `id` = 1;

-- Item 2: INESIS Umbrella Unisex MICROPLUS Lightweight
UPDATE `Product`
SET 
  `brand` = 'INESIS',
  `name` = 'Umbrella Unisex MICROPLUS Lightweight',
  `price` = 699,
  `mrp` = 949,
  `discountTag` = NULL,
  `imageUrl` = 'https://media.istockphoto.com/id/1852243832/photo/umbrella-and-city-lights-at-night.jpg?s=2048x2048&w=is&k=20&c=k3WlVdwmwS1QscMhE-tKqB86oeg7kyG2AEHIbGY2lss=',
  `category` = 'STORM PROOF.'
WHERE `id` = 2;

-- Item 3: INESIS Umbrella Unisex ProFilter Medium Eco-Friendly Red
UPDATE `Product`
SET 
  `brand` = 'INESIS',
  `name` = 'Umbrella Unisex ProFilter Medium Eco-Friendly Red',
  `price` = 699,
  `mrp` = 1499,
  `discountTag` = '53% OFF',
  `imageUrl` = 'https://media.istockphoto.com/id/1852243832/photo/umbrella-and-city-lights-at-night.jpg?s=2048x2048&w=is&k=20&c=k3WlVdwmwS1QscMhE-tKqB86oeg7kyG2AEHIbGY2lss=',
  `category` = 'STORM PROOF.'
WHERE `id` = 3;

-- Item 4: INESIS Umbrella Unisex ProFilter Medium Eco-Friendly Black
UPDATE `Product`
SET 
  `brand` = 'INESIS',
  `name` = 'Umbrella Unisex ProFilter Medium Eco-Friendly Black',
  `price` = 999,
  `mrp` = 1499,
  `discountTag` = 'Buy 2 @ ₹1899 & Save ₹99',
  `imageUrl` = 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 4;

-- Item 5: QUECHUA Rain Poncho Unisex Hiking Lightweight Waterproof
UPDATE `Product`
SET 
  `brand` = 'QUECHUA',
  `name` = 'Rain Poncho Unisex Hiking Lightweight Waterproof',
  `price` = 799,
  `mrp` = 1499,
  `discountTag` = NULL,
  `imageUrl` = 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 5;

-- Check to verify the values are accurately stored
SELECT * FROM `Product` WHERE `category` = 'STORM PROOF.';



USE `decathlon`;

-- Item 1: DECATHLON Umbrella Unisex ProFilter Small Eco-Friendly
UPDATE `Product`
SET 
  `brand` = 'DECATHLON',
  `name` = 'Umbrella Unisex ProFilter Small Eco-Friendly',
  `price` = 799,
  `mrp` = 1299,
  `discountTag` = 'PRICE DROP',
  `imageUrl` = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 1;

-- Item 2: INESIS Umbrella Unisex MICROPLUS Lightweight
UPDATE `Product`
SET 
  `brand` = 'INESIS',
  `name` = 'Umbrella Unisex MICROPLUS Lightweight',
  `price` = 699,
  `mrp` = 949,
  `discountTag` = NULL,
  `imageUrl` = 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 2;

-- Item 3: INESIS Umbrella Unisex ProFilter Medium Eco-Friendly Red
UPDATE `Product`
SET 
  `brand` = 'INESIS',
  `name` = 'Umbrella Unisex ProFilter Medium Eco-Friendly Red',
  `price` = 699,
  `mrp` = 1499,
  `discountTag` = '53% OFF',
  `imageUrl` = 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 3;

-- Item 4: INESIS Umbrella Unisex ProFilter Medium Eco-Friendly Black
UPDATE `Product`
SET 
  `brand` = 'INESIS',
  `name` = 'Umbrella Unisex ProFilter Medium Eco-Friendly Black',
  `price` = 999,
  `mrp` = 1499,
  `discountTag` = 'Buy 2 @ ₹1899 & Save ₹99',
  `imageUrl` = 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 4;

-- Item 5: QUECHUA Rain Poncho Unisex Hiking Lightweight Waterproof
UPDATE `Product`
SET 
  `brand` = 'QUECHUA',
  `name` = 'Rain Poncho Unisex Hiking Lightweight Waterproof',
  `price` = 799,
  `mrp` = 1499,
  `discountTag` = NULL,
  `imageUrl` = 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 5;

-- Check to verify the values are accurately stored
SELECT * FROM `Product` WHERE `category` = 'STORM PROOF.';




USE `decathlon`;

-- =========================================================================
-- SECTION 1: "STORM PROOF." CATEGORY UPDATES
-- =========================================================================

-- Product 1: DECATHLON Umbrella Unisex ProFilter Small Eco-Friendly
UPDATE `Product`
SET 
  `brand` = 'DECATHLON',
  `name` = 'Umbrella Unisex ProFilter Small Eco-Friendly',
  `price` = 799,
  `mrp` = 1299,
  `discountTag` = 'PRICE DROP',
  `imageUrl` = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 1;

-- Product 2: INESIS Umbrella Unisex MICROPLUS Lightweight
UPDATE `Product`
SET 
  `brand` = 'INESIS',
  `name` = 'Umbrella Unisex MICROPLUS Lightweight',
  `price` = 699,
  `mrp` = 949,
  `discountTag` = NULL,
  `imageUrl` = 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 2;

-- Product 3: INESIS Umbrella Unisex ProFilter Medium Eco-Friendly Red
UPDATE `Product`
SET 
  `brand` = 'INESIS',
  `name` = 'Umbrella Unisex ProFilter Medium Eco-Friendly Red',
  `price` = 699,
  `mrp` = 1499,
  `discountTag` = '53% OFF',
  `imageUrl` = 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 3;

-- Product 4: INESIS Umbrella Unisex ProFilter Medium Eco-Friendly Black
UPDATE `Product`
SET 
  `brand` = 'INESIS',
  `name` = 'Umbrella Unisex ProFilter Medium Eco-Friendly Black',
  `price` = 999,
  `mrp` = 1499,
  `discountTag` = 'Buy 2 @ ₹1899 & Save ₹99',
  `imageUrl` = 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 4;

-- Product 5: QUECHUA Rain Poncho Unisex Hiking Lightweight Waterproof
UPDATE `Product`
SET 
  `brand` = 'QUECHUA',
  `name` = 'Rain Poncho Unisex Hiking Lightweight Waterproof',
  `price` = 799,
  `mrp` = 1499,
  `discountTag` = NULL,
  `imageUrl` = 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=600',
  `category` = 'STORM PROOF.'
WHERE `id` = 5;


-- =========================================================================
-- SECTION 2: "Shop your Workout Checklist" CATEGORY UPDATES
-- =========================================================================

-- Product 6: DOMYOS Men Gym Trackpant Convertible Jog Fit Quick Dry
UPDATE `Product`
SET 
  `brand` = 'DOMYOS',
  `name` = 'Men Gym Trackpant Convertible, Jog Fit, Quick Dry',
  `price` = 999,
  `mrp` = 999,
  `discountTag` = 'Buy 3 @ 2847 and Save 150',
  `imageUrl` = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600',
  `category` = 'Shop your Workout Checklist'
WHERE `id` = 6;

-- Product 7: DOMYOS Men Fitness Tracksuit Jacket with Moisture Management
UPDATE `Product`
SET 
  `brand` = 'DOMYOS',
  `name` = 'Men Fitness Tracksuit Jacket with Moisture...',
  `price` = 999,
  `mrp` = 1699,
  `discountTag` = NULL,
  `imageUrl` = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600',
  `category` = 'Shop your Workout Checklist'
WHERE `id` = 7;

-- Product 8: DOMYOS Men Gym Shorts Stretchable Quick Dry
UPDATE `Product`
SET 
  `brand` = 'DOMYOS',
  `name` = 'Men Gym Shorts, Stretchable, Quick Dry and...',
  `price` = 399,
  `mrp` = 699,
  `discountTag` = NULL,
  `imageUrl` = 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600',
  `category` = 'Shop your Workout Checklist'
WHERE `id` = 8;

-- Product 9: DOMYOS Men Gym Trackpants Slim Fit Jogger Style Breathable
UPDATE `Product`
SET 
  `brand` = 'DOMYOS',
  `name` = 'Men Gym Trackpants Slim Fit Jogger Style, Breathabl...',
  `price` = 899,
  `mrp` = 1699,
  `discountTag` = NULL,
  `imageUrl` = 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=600',
  `category` = 'Shop your Workout Checklist'
WHERE `id` = 9;

-- Product 10: DECATHLON Men Walking EVA Sole Lightweight
UPDATE `Product`
SET 
  `brand` = 'DECATHLON',
  `name` = 'Men Walking EVA Sole, Lightweight and...',
  `price` = 2299,
  `mrp` = 2299,
  `discountTag` = NULL,
  `imageUrl` = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
  `category` = 'Shop your Workout Checklist'
WHERE `id` = 10;

-- Commit changes and fetch records to ensure they are parsed
SELECT * FROM `Product`;




USE `decathlon`;

-- =========================================================================
-- SECTION 1: "STORM PROOF." PRODUCT IMAGES
-- =========================================================================

-- Item 1: DECATHLON Umbrella Unisex ProFilter Small Eco-Friendly
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1517398629-9d24ea1f4f94?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE `id` = 1;

-- Item 2: INESIS Umbrella Unisex MICROPLUS Lightweight
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1498947078984-b4b349cabc29?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
WHERE `id` = 2;

-- Item 3: INESIS Umbrella Unisex ProFilter Medium Eco-Friendly Red
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?q=80&w=600'
WHERE `id` = 3;

-- Item 4: INESIS Umbrella Unisex ProFilter Medium Eco-Friendly Black
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=600'
WHERE `id` = 4;

-- Item 5: QUECHUA Rain Poncho Unisex Hiking Lightweight Waterproof
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=600'
WHERE `id` = 5;


-- =========================================================================
-- SECTION 2: "Shop your Workout Checklist" PRODUCT IMAGES
-- =========================================================================

-- Item 6: DOMYOS Men Gym Trackpant Convertible Jog Fit Quick Dry
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600'
WHERE `id` = 6;

-- Item 7: DOMYOS Men Fitness Tracksuit Jacket with Moisture Management
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600'
WHERE `id` = 7;

-- Item 8: DOMYOS Men Gym Shorts Stretchable Quick Dry
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600'
WHERE `id` = 8;

-- Item 9: DOMYOS Men Gym Trackpants Slim Fit Jogger Style Breathable
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=600'
WHERE `id` = 9;

-- Item 10: DECATHLON Men Walking EVA Sole Lightweight
UPDATE `Product`
SET `imageUrl` = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600'
WHERE `id` = 10;


-- =========================================================================
-- VERIFICATION RULE
-- =========================================================================
SELECT `id`, `brand`, `name`, `category`, `imageUrl` FROM `Product`;



USE `decathlon`;

-- Ensure your core Product entity fields match the design requirements
CREATE TABLE IF NOT EXISTS `Product` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `brand` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` INT NOT NULL,
    `mrp` INT NOT NULL,
    `discountTag` VARCHAR(150) DEFAULT NULL,
    `imageUrl` VARCHAR(1000) NOT NULL,
    `category` VARCHAR(100) NOT NULL
);

-- Wipe out old mismatched product rows
TRUNCATE TABLE `Product`;

-- Ingest exact item assets matching your design screenshots
INSERT INTO `Product` (`brand`, `name`, `price`, `mrp`, `discountTag`, `imageUrl`, `category`) VALUES
('DECATHLON', 'Umbrella Unisex ProFilter Small Eco-Friendly', 799, 1299, 'PRICE DROP', 'https://media.istockphoto.com/id/1852243832/photo/umbrella-and-city-lights-at-night.jpg?s=2048x2048&w=is&k=20&c=k3WlVdwmwS1QscMhE-tKqB86oeg7kyG2AEHIbGY2lss=', 'STORM PROOF.'),
('INESIS', 'Umbrella Unisex MICROPLUS Lightweight', 699, 949, NULL, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600', 'STORM PROOF.'),
('INESIS', 'Umbrella Unisex ProFilter Medium Eco-Friendly Red', 699, 1499, '53% OFF', 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?q=80&w=600', 'STORM PROOF.'),
('INESIS', 'Umbrella Unisex ProFilter Medium Eco-Friendly Black', 999, 1499, 'Buy 2 @ ₹1899 & Save ₹99', 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=600', 'STORM PROOF.'),
('QUECHUA', 'Rain Poncho Unisex Hiking Lightweight Waterproof', 799, 1499, NULL, 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=600', 'STORM PROOF.'),
('DOMYOS', 'Men Gym Trackpant Convertible, Jog Fit, Quick Dry', 999, 999, 'Buy 3 @ 2847 and Save 150', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600', 'Shop your Workout Checklist'),
('DOMYOS', 'Men Fitness Tracksuit Jacket with Moisture...', 999, 1699, NULL, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600', 'Shop your Workout Checklist'),
('DOMYOS', 'Men Gym Shorts, Stretchable, Quick Dry and...', 399, 699, NULL, 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600', 'Shop your Workout Checklist'),
('DOMYOS', 'Men Gym Trackpants Slim Fit Jogger Style, Breathabl...', 899, 1699, NULL, 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=600', 'Shop your Workout Checklist'),
('DECATHLON', 'Men Walking EVA Sole, Lightweight and...', 2299, 2299, NULL, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', 'Shop your Workout Checklist');





USE `decathlon`;

-- 1. Drop the table if structural changes are locked
DROP TABLE IF EXISTS `Product`;

-- 2. Create the fixed schema matching your design with precise default overrides
CREATE TABLE `Product` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `brand` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` INT NOT NULL,
    `mrp` INT NOT NULL,
    `rating` DECIMAL(3,2) DEFAULT 4.5, -- Fixed default fallback constraint
    `reviews` VARCHAR(50) DEFAULT '4.5k', -- Fixed default fallback constraint
    `discountTag` VARCHAR(150) DEFAULT NULL,
    `imageUrl` VARCHAR(1000) NOT NULL,
    `category` VARCHAR(100) NOT NULL
);

-- 3. Ingest your verified direct image asset stream records cleanly
INSERT INTO `Product` (`brand`, `name`, `price`, `mrp`, `discountTag`, `imageUrl`, `category`) VALUES
('DECATHLON', 'Umbrella Unisex ProFilter Small Eco-Friendly', 799, 1299, 'PRICE DROP', 'https://media.istockphoto.com/id/1852243832/photo/umbrella-and-city-lights-at-night.jpg?s=2048x2048&w=is&k=20&c=k3WlVdwmwS1QscMhE-tKqB86oeg7kyG2AEHIbGY2lss=', 'STORM PROOF.'),
('INESIS', 'Umbrella Unisex MICROPLUS Lightweight', 699, 949, NULL, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600', 'STORM PROOF.'),
('INESIS', 'Umbrella Unisex ProFilter Medium Eco-Friendly Red', 699, 1499, '53% OFF', 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?q=80&w=600', 'STORM PROOF.'),
('INESIS', 'Umbrella Unisex ProFilter Medium Eco-Friendly Black', 999, 1499, 'Buy 2 @ ₹1899 & Save ₹99', 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=600', 'STORM PROOF.'),
('QUECHUA', 'Rain Poncho Unisex Hiking Lightweight Waterproof', 799, 1499, NULL, 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=600', 'STORM PROOF.'),
('DOMYOS', 'Men Gym Trackpant Convertible, Jog Fit, Quick Dry', 999, 999, 'Buy 3 @ 2847 and Save 150', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600', 'Shop your Workout Checklist'),
('DOMYOS', 'Men Fitness Tracksuit Jacket with Moisture...', 999, 1699, NULL, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600', 'Shop your Workout Checklist'),
('DOMYOS', 'Men Gym Shorts, Stretchable, Quick Dry and...', 399, 699, NULL, 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600', 'Shop your Workout Checklist'),
('DOMYOS', 'Men Gym Trackpants Slim Fit Jogger Style, Breathabl...', 899, 1699, NULL, 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=600', 'Shop your Workout Checklist'),
('DECATHLON', 'Men Walking EVA Sole, Lightweight and...', 2299, 2299, NULL, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', 'Shop your Workout Checklist');

-- 4. Verify everything is populated safely
SELECT * FROM `Product`;