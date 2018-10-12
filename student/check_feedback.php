<?php
//-----------------获取接口变量----------------------------------------------

$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];
$taskid=$_GET['taskid'];


//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';

$query="UPDATE feedback SET checked=1 WHERE userid='$userid' AND taskid='$taskid'";
mysqli_query($link,$query);
mysqli_close($link);
echo(json_encode('feedback checked!'));