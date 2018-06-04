<?php
//-----------------获取接口变量----------------------------------------------

$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];
$taskid=$_GET['taskid'];
/*
$userid=1;
$taskid=1;*/
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use database1');

$query="UPDATE feedback SET checked=1 WHERE userid='$userid' AND taskid='$taskid'";
mysqli_query($link,$query);
mysqli_close($link);
echo(json_encode('feedback checked!'));