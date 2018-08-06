<?php
//-----------------获取接口变量----------------------------------------------

$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];
$taskid=$_GET['taskid'];

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

$query="UPDATE feedback SET checked=1 WHERE userid='$userid' AND taskid='$taskid'";
mysqli_query($link,$query);
mysqli_close($link);
echo(json_encode('feedback checked!'));