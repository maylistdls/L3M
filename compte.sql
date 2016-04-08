-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Host: mysql1.alwaysdata.com
-- Generation Time: Apr 07, 2016 at 11:10 AM
-- Server version: 5.1.66-0+squeeze1
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `maxoutigrou62_auth`
--
CREATE DATABASE IF NOT EXISTS `maxoutigrou62_auth` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `maxoutigrou62_auth`;

-- --------------------------------------------------------

--
-- Table structure for table `joueur`
--

DROP TABLE IF EXISTS `joueur`;
CREATE TABLE IF NOT EXISTS `joueur` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `login` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `joueur`
--

INSERT INTO `joueur` (`id`, `login`, `password`, `email`) VALUES
(1, 'toto', 'c33ca5e7eae116138d1d1b61158d58f9', 'toto@hotmail.com'),
(2, 'marcel', '71c5a7a74ccadc2b06978a682f0bf07a', 'marcel@marcel.fr'),
(3, 'apple', 'c62406846525b5d1ae388252e97eebc2', 'apple@apple.fr'),
(4, 'savoir', '721253eef9df60e95b6a2e1ae27b09db', 'savoir@savoir.fr'),
(5, 'triangle', '9f507b22d00ca38fc1268d0a1ac55a95', 'triangle@triangle.fr'),
(6, 'six', '54d0b65dbce1bcae13e1329438d021bf', 'six@six.fr');

-- --------------------------------------------------------

--
-- Table structure for table `joueur_partie`
--

DROP TABLE IF EXISTS `joueur_partie`;
CREATE TABLE IF NOT EXISTS `joueur_partie` (
  `idjoueur` int(2) NOT NULL,
  `idpartie` int(2) NOT NULL,
  `equipe` int(1) NOT NULL,
  `chef` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `partie`
--

DROP TABLE IF EXISTS `partie`;
CREATE TABLE IF NOT EXISTS `partie` (
  `numeroPartie` int(2) NOT NULL,
  UNIQUE KEY `numeroPartie` (`numeroPartie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `partie`
--

INSERT INTO `partie` (`numeroPartie`) VALUES
(1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
