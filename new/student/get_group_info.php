<?php

$sid=$_GET['sid'];
session_id($sid);
session_start();
$groupid=$_SESSION['groupid'];
$classid=$_SESSION['classid'];
//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//选择数据库
mysqli_query($link,'use database1');

$query="SELECT username FROM account WHERE classid='$classid' AND role='tutor' LIMIT 1";
$ret=mysqli_query($link,$query);
$tutor_name_array=mysqli_fetch_assoc($ret);
$tutor_name=$tutor_name_array['username'];
//获取小组全部学生成员
$query="SELECT username FROM account WHERE classid='$classid' AND groupid='$groupid' AND role='student'";
$ret=mysqli_query($link,$query);
mysqli_close($link);
$info=array();
while ($stuname=mysqli_fetch_assoc($ret)){
    $info[]=$stuname['username'];
}
$info[]=$tutor_name;
echo(json_encode($info));