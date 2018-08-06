<?php

date_default_timezone_set('PRC');

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$taskid=$_GET['taskid'];
$userid = $_SESSION['userid'];
$time = date('Y-m-d H:i:s', time());
$username = $_SESSION['username'];
$groupid = $_SESSION['groupid'];
$classid=$_SESSION['classid'];
$numberingroup=$_SESSION['numberingroup'];

//-----------------mysql参数----------------------------------------------
$servername = "47.96.146.26";
$usern = "root";
$passw = "B4F393c91945";
$dbname = "mysql";
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect($servername,$usern ,$passw);;
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use '.$dbname);


$query="INSERT INTO log(timeStamp,classid,groupid,groupNO,userid,username,actiontype,taskid) VALUES ('$time','$classid',
          '$groupid','$numberingroup','$userid','$username','ReadTask','$taskid')";
mysqli_query($link, $query);
mysqli_close($link);
echo("readtasklog");