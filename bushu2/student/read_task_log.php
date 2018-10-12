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

//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';


$query="INSERT INTO log(timeStamp,classid,groupid,groupNO,userid,username,actiontype,taskid) VALUES ('$time','$classid',
          '$groupid','$numberingroup','$userid','$username','ReadTask','$taskid')";
mysqli_query($link, $query);
mysqli_close($link);
echo("readtasklog");