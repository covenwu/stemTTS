<?php
/*
功能：teacher向数据库插入聊天信息
接口:1.从session获得teacher的id
提示：1.处理到发送消息，用户信息是否存储问题
      2.全部用户数据只查询一次后存到session
待办：groupid的正确获取
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
$id=1;


//从session获取id
//session_start();
//$id=$_SESSION["id"];

//检查输入的聊天信息，若为空则提示用户并结束
if($_POST['msg']==""){
    echo ("请输入信息哦orz");
    exit;
}

//获取传递的变量
$msg=$_POST['msg'];
$sender='老张';       //1111 应动态获取
//$receiver=$_POST['receiver'];   //1111 待确认是否取消
//$color=$_POST['color'];
//$biaoqing=$_POST['biaoqing'];
$add_time=date('Y-m-d H:i:s',time());
$groupid=$_POST['chatroomid'];                  //1111


//-----------------对应插入新纪录----------------------------------------------
$query="insert into message(msg,sender,add_time,groupid) values('$msg','$sender','$add_time','$groupid')";

mysqli_query($link,$query);

//回显发送成功提示
echo("success");
