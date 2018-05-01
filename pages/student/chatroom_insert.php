<?php
/*
功能：1.将聊天数据插入数据表
接口：1.从post和session获取变量，见下方源代码‘获取接口变量部分’
待办：1.groupid的动态获取
*/
//-----------------测试用----------------------------------------------
$groupid=1;

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//选择数据库
mysqli_query($link,'use database1');


//检查输入的聊天信息，若为空则提示用户并结束
if($_POST['msg']==""){
    echo ("请输入信息哦orz");
    exit;
}


//-----------------获取接口变量----------------------------------------------
//开启session
$sid=$_POST['sid'];

session_id($sid);
session_start();
$msg=$_POST['msg'];
$sender=$_SESSION['username'];
//$groupid=$_SESSION['groupid']                                             1111

$add_time=date('Y-m-d H:i:s',time());

//-----------------对应插入新纪录----------------------------------------------
$query="insert into message(msg,sender,groupid,add_time) values('$msg','$sender','$groupid','$add_time')";
mysqli_query($link,$query);

//回显发送成功提示
echo("success");
