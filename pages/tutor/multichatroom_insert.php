<?php
/*
功能：1.teacher向数据库插入聊天信息
接口:1.session,post,见下方代码‘获取接口变量’部分
待办：1.groupid获取
*/

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
//var_dump($link);
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//选择数据库
mysqli_query($link,'use database1');

//-----------------测试部分----------------------------------------------
//$groupid=1;
//-----------------获取接口变量----------------------------------------------

$sid=$_POST['sid'];

session_id($sid);
session_start();
$username=$_SESSION['username'];
$msg=$_POST['msg'];
$groupid=$_SESSION['group'.$_POST['chatroomid']];


$add_time=date('Y-m-d H:i:s',time());

//检查输入的聊天信息，若为空则提示用户并结束
if($_POST['msg']==""){
    echo ("请输入信息哦orz");
    exit;
}

//-----------------对应插入新纪录----------------------------------------------
$query="insert into message(msg,sender,add_time,groupid) values('$msg','$username','$add_time','$groupid')";
mysqli_query($link,$query);

//回显发送成功提示
echo("success");
