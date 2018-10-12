<?php
/*
功能：1.teacher向数据库插入聊天信息
接口:1.session,post,见下方代码‘获取接口变量’部分
待办：1.groupid获取
*/
//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$username="张华";
$msg=$_GET['msg'];
$groupid=$_GET['chatroomid'];
$classid=$_GET['classid'];
$userid=$_SESSION['userid'];
$time=date('Y-m-d H:i:s',time());

//检查输入的聊天信息，若为空则提示用户并结束
if($_GET['msg']==""){
    echo ("请输入信息哦orz");
    exit;
}

//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';

//-----------------对应插入新纪录----------------------------------------------
//$query="insert into message(msg,sender,add_time,groupid) values('$msg','$username','$add_time','$groupid')";
$query="INSERT INTO log(timeStamp,classid,username,actiontype,content,groupid) VALUES ('$time','$classid','$username','ChatMsg','$msg','$groupid')";
mysqli_query($link,$query);
$query="INSERT INTO chat(timeStamp,classid,username,content,groupid) VALUES ('$time','$classid','$username','$msg','$groupid')";
mysqli_query($link,$query);

mysqli_close($link);
//回显发送成功提示
echo("success");
