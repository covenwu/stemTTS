-- MySQL dump 10.13  Distrib 5.7.14, for Win64 (x86_64)
--
-- Host: localhost    Database: database2
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(20) NOT NULL,
  `username` varchar(10) NOT NULL,
  `classid` varchar(30) DEFAULT '0',
  `groupid` int(11) DEFAULT '0',
  `role` enum('admin','tutor','student') NOT NULL,
  `emailaddress` varchar(50) DEFAULT NULL,
  `numberingroup` int(11) DEFAULT NULL,
  `tutorid` int(11) DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'123','student30','0',0,'student','30@qq.com',NULL,NULL),(2,'123','student31','0',0,'student','31@qq.com',NULL,NULL),(3,'123','student32','0',0,'student','32@qq.com',NULL,NULL),(4,'123','student33','0',0,'student','33@qq.com',NULL,NULL),(5,'123','student34','0',0,'student','34@qq.com',NULL,NULL),(6,'123','student35','0',0,'student','35@qq.com',NULL,NULL),(7,'123','student36','0',0,'student','36@qq.com',NULL,NULL),(8,'123','tutor1','0',0,'tutor','12@qq.com',NULL,1);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat` (
  `timeStamp` datetime NOT NULL,
  `classid` varchar(30) NOT NULL,
  `groupid` int(11) DEFAULT NULL,
  `username` varchar(10) DEFAULT NULL,
  `content` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classinfo`
--

DROP TABLE IF EXISTS `classinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classinfo` (
  `classid` int(11) DEFAULT NULL,
  `classname` varchar(30) DEFAULT NULL,
  `autosend` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classinfo`
--

LOCK TABLES `classinfo` WRITE;
/*!40000 ALTER TABLE `classinfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `classinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback` (
  `timeStamp` datetime NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `taskid` int(11) DEFAULT NULL,
  `content` text,
  `evaluation` text,
  `checked` tinyint(4) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_attr`
--

DROP TABLE IF EXISTS `group_attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_attr` (
  `classid` int(11) NOT NULL,
  `groupid` int(11) NOT NULL,
  `taskidnow` int(11) NOT NULL DEFAULT '1',
  `oknumber` int(11) DEFAULT '0',
  `sharefile` text,
  `filename` text,
  `sharetime` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_attr`
--

LOCK TABLES `group_attr` WRITE;
/*!40000 ALTER TABLE `group_attr` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_attr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homework_mood`
--

DROP TABLE IF EXISTS `homework_mood`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `homework_mood` (
  `userid` int(11) NOT NULL,
  `taskid` int(11) NOT NULL,
  `evaluation` enum('未提交','批改中','待修改','通过') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homework_mood`
--

LOCK TABLES `homework_mood` WRITE;
/*!40000 ALTER TABLE `homework_mood` DISABLE KEYS */;
/*!40000 ALTER TABLE `homework_mood` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `timeStamp` datetime NOT NULL,
  `classid` varchar(30) NOT NULL,
  `groupid` int(11) DEFAULT NULL,
  `groupNO` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `username` varchar(10) DEFAULT NULL,
  `actiontype` enum('ReportSubmit','ReportFeedback','ChatMsg','TaskEmail','ReadTask','EditReport','ReadResource') NOT NULL,
  `taskid` int(11) DEFAULT NULL,
  `content` text,
  `url` text,
  `checked` tinyint(4) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onlineuser`
--

DROP TABLE IF EXISTS `onlineuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `onlineuser` (
  `userid` int(11) NOT NULL,
  `username` varchar(10) NOT NULL,
  `groupid` int(11) NOT NULL,
  `classid` int(11) NOT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onlineuser`
--

LOCK TABLES `onlineuser` WRITE;
/*!40000 ALTER TABLE `onlineuser` DISABLE KEYS */;
/*!40000 ALTER TABLE `onlineuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `classid` int(11) DEFAULT NULL,
  `groupid` int(11) DEFAULT NULL,
  `groupNO` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `taskid` int(11) DEFAULT NULL,
  `content` text,
  `url` text,
  `urlname` text,
  `timeStamp` datetime DEFAULT NULL,
  `shared` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `userid` int(11) DEFAULT NULL,
  `timeStamp` text,
  `checked` tinyint(4) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-09 16:10:49
