<?php
/*
功能：1.学生提交作业的后台处理
接口：1.从$_GET和$_SESSION,见下方源代码‘获取接口变量’部分
        2.homework_history表
待办：1.classid获取
*/
//-----------------测试用----------------------------------------------

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//选择数据库
mysqli_query($link,'use database1');

//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$text=$_GET["text"];
$userid=$_SESSION['userid'];
$taskidnow=$_SESSION['taskidnow'];
$classid=$_SESSION['classid'];                      //1111
$username=$_SESSION['username'];
$time=date('Y-m-d H:i:s',time());
$groupid=$_SESSION['groupid'];
$numberingroup=$_SESSION['numberingroup'];
//echo($taskidnow);


//-----------------对应插入新纪录---------------------------------------------

$query="insert into homework_history(time,classid,userid,username,taskid,homeworkcontent,evaluation,groupid,numberingroup) values('$time'
          ,'$classid','$userid','$username','$taskidnow','$text','批改中','$groupid','$numberingroup')";
mysqli_query($link,$query);

//回显发送成功提示
echo("作业提交成功！");

