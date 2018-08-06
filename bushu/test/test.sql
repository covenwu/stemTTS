-- MySQL dump 10.13  Distrib 5.7.14, for Win64 (x86_64)
--
-- Host: localhost    Database: database1
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'123','student0','1',1,'student','0@qq.com',1,NULL),(2,'123','student1','1',1,'student','1@qq.com',2,NULL),(3,'123','student2','1',1,'student','2@qq.com',3,NULL),(4,'123','student3','1',1,'student','3@qq.com',4,NULL),(5,'123','student4','1',2,'student','4@qq.com',1,NULL),(6,'123','student5','1',2,'student','5@qq.com',2,NULL),(7,'123','student6','1',2,'student','6@qq.com',3,NULL),(8,'123','student7','1',2,'student','7@qq.com',4,NULL),(9,'123','student8','1',3,'student','8@qq.com',1,NULL),(10,'123','student9','1',3,'student','9@qq.com',2,NULL),(11,'123','student10','1',3,'student','10@qq.com',3,NULL),(12,'123','student11','1',3,'student','11@qq.com',4,NULL),(13,'123','student16','1',4,'student','13@qq.com',1,NULL),(14,'123','student17','1',4,'student','14@qq.com',2,NULL),(15,'123','student18','1',4,'student','15@qq.com',3,NULL),(16,'123','student19','1',4,'student','16@qq.com',4,NULL),(17,'123','student12','2',3,'student','20@qq.com',1,NULL),(18,'123','student13','2',3,'student','21@qq.com',2,NULL),(19,'123','student14','2',3,'student','22@qq.com',3,NULL),(20,'123','student15','2',3,'student','23@qq.com',4,NULL),(21,'123','student30','0',0,'student','30@qq.com',NULL,NULL),(22,'123','tutor1','1',0,'tutor','12@qq.com',NULL,1),(23,'123','tutor1','2',0,'tutor','12@qq.com',NULL,1),(24,'123','tutor1','3',0,'tutor','12@qq.com',NULL,1),(25,'123','tutor1','4',0,'tutor','12@qq.com',NULL,1);
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
INSERT INTO `group_attr` VALUES (1,1,1,0,NULL,NULL,NULL),(1,2,1,0,NULL,NULL,NULL),(1,3,1,0,NULL,NULL,NULL),(1,4,1,0,NULL,NULL,NULL),(2,1,1,0,NULL,NULL,NULL),(2,2,1,0,NULL,NULL,NULL),(2,3,1,0,NULL,NULL,NULL),(2,4,1,0,NULL,NULL,NULL);
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
INSERT INTO `log` VALUES ('1000-01-02 00:00:00','1',1,NULL,NULL,NULL,'TaskEmail',1,'系统任务1',NULL,0);
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
INSERT INTO `task` VALUES (1,'1000-01-02 00:00:00',0),(2,'1000-01-02 00:00:00',0),(3,'1000-01-02 00:00:00',0),(4,'1000-01-02 00:00:00',0);
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

-- Dump completed on 2018-07-28 11:26:44
