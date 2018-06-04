<?php
/*
功能：1.学生提交作业的后台处理
接口：1.从$_GET和$_SESSION,sid,见下方源代码‘获取接口变量’部分
        2.homework_history表
提示：有可移至前端完成的查询
*/

header('content-type:text/html;charset=utf-8');

//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//-----------------获取接口变量----------------------------------------------
$taskidnow=$_GET['taskidnow'];
$sid=$_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];
$classid=$_SESSION['classid'];
$groupid=$_SESSION['groupid'];
$numberingroup=$_SESSION['numberingroup'];
$url='';
$text=$_GET['text'];

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');
//-----------------对应插入新纪录---------------------------------------------

$query="UPDATE report SET classid='$classid',groupid='$groupid',groupNO='$numberingroup',userid='$userid',taskid='$taskidnow',content='$text',url='$url' WHERE  userid='$userid' AND taskid='$taskidnow'";
mysqli_query($link,$query);

mysqli_close($link);
//回显发送成功提示
echo(json_encode("draft saved"));


