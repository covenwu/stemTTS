<?php

//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//-----------------常量设置----------------------------------------------
$offlinetime=60;
$groupnum=4;
//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];
$username=$_SESSION['username'];
$classid=$_SESSION['classid'];
$time=date('Y-m-d H:i:s',time());



//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';

//删除离线用户
$query="delete from onlineuser where TIMESTAMPDIFF(SECOND,time,'$time') >'$offlinetime'";
mysqli_query($link,$query);

//将请求这个文件的用户写入记录
//先删除这个用户的旧记录
$query="delete from onlineuser where userid='$userid'";
mysqli_query($link,$query);

//写入新记录
$query="insert into onlineuser(userid,username,groupid,time,classid) values('$userid','$username',1,'$time','$classid'),
    ('$userid','$username',2,'$time','$classid'),('$userid','$username',3,'$time','$classid'),('$userid','$username',4,'$time','$classid')";
mysqli_query($link,$query);

echo('update online user successfully');

