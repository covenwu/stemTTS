<?php
//学生提交作业的后台处理
/*
1.获取taskid
*/

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
//var_dump($link);
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');

//选择数据库
mysqli_query($link,'use database1');




$msg=$_POST['msg'];
$sender='老张';
$receiver=$_POST['receiver'];
$color=$_POST['color'];
$biaoqing=$_POST['biaoqing'];
$add_time=date('Y-m-d H:i:s',time());


//-----------------对应插入新纪录----------------------------------------------


$query="insert into message(msg,sender,receiver,color,biaoqing,add_time) values('$msg','$sender','$receiver'
            ,'$color','$biaoqing','$add_time')";

mysqli_query($link,$query);

//回显发送成功提示
echo("success");