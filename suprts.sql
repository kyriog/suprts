-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Ven 14 Juin 2013 à 15:22
-- Version du serveur: 5.5.27
-- Version de PHP: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `suprts`
--

-- --------------------------------------------------------

--
-- Structure de la table `chunks`
--

CREATE TABLE IF NOT EXISTS `chunks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `x` int(10) NOT NULL,
  `y` int(10) NOT NULL,
  `data` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `config`
--

CREATE TABLE IF NOT EXISTS `config` (
  `config_name` varchar(30) NOT NULL,
  `config_value` int(11) NOT NULL,
  PRIMARY KEY (`config_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `config`
--

INSERT INTO `config` (`config_name`, `config_value`) VALUES
('baseHp', 10),
('baseRegen', 1),
('cornDecay', 10),
('cornFertility', 10),
('cornHumidity', 10),
('cornMaturation', 10),
('cornPrice', 10),
('cornProductivity', 10),
('cornStorability', 10),
('fertilizerAddFertility', 10),
('fertilizerCost', 10),
('gracetimeBase', 3600),
('gracetimeReductionPerLevel', 60),
('hardLevelMoneyDivider', 10),
('hitDamage', 5),
('hitEachXSeconds', 2000),
('hitRatio', 1),
('hpPerLevel', 10),
('normalLevelMoneyDivider', 2),
('plantBestSell', 200),
('plantCorrectSell', 100),
('regenEachXSeconds', 3),
('regenPerLevel', 1),
('startMoney', 1000),
('tomatoDecay', 10),
('tomatoFertility', 10),
('tomatoHumidity', 10),
('tomatoMaturation', 10),
('tomatoPrice', 10),
('tomatoProductivity', 10),
('tomatoStorability', 10),
('wateringAddHumidity', 10),
('wheatDecay', 10),
('wheatFertility', 10),
('wheatHumidity', 10),
('wheatMaturation', 10),
('wheatPrice', 10),
('wheatProductivity', 10),
('wheatStorability', 10);

-- --------------------------------------------------------

--
-- Structure de la table `plants`
--

CREATE TABLE IF NOT EXISTS `plants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `type` varchar(2555) NOT NULL,
  `percent` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(40) NOT NULL,
  `is_administrator` tinyint(1) NOT NULL DEFAULT '0',
  `difficulty` enum('easy','normal','hard') NOT NULL,
  `money` int(10) unsigned NOT NULL,
  `level` int(10) unsigned NOT NULL DEFAULT '0',
  `hp` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_2` (`email`),
  KEY `email` (`email`,`password`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `is_administrator`, `difficulty`, `money`, `level`, `hp`) VALUES
(1, 'admin@local', 'd033e22ae348aeb5660fc2140aec35850c4da997', 1, 'easy', 1000, 0, 10);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
