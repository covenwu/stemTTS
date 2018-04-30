<?php
/*
功能：1.更新并返回在线用户表
接口：1.$_SESSION,见下方源代码‘获取接口变量'部分
提示：1.在线用户表只记录用户id和访问本文件的时间戳，每次本文件被访问会将最近一次访问据当前时间超过一段时间的用户从表中删除，然后返回
表中的所有用户id。
*/
header("Content-Type:application/json");

//-----------------测试用----------------------------------------------

//-----------------常量设置----------------------------------------------
$offlinetime=60;

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//选择数据库
mysqli_query($link,'use database1');

session_start();
//-----------------获取接口变量----------------------------------------------
$userid=$_SESSION['userid'];
$username=$_SESSION['username'];
$groupid=$_SESSION['groupid'];

$time=date('Y-m-d H:i:s',time());
//删除离线用户
$query="delete from onlineuser where TIMESTAMPDIFF(SECOND,time,'$time') >'$offlinetime'";
mysqli_query($link,$query);

//将请求这个文件的用户写入记录
//先删除这个用户的旧记录
$query="delete from onlineuser where userid='$userid'";
mysqli_query($link,$query);
//写入新记录
$query="insert into onlineuser(userid,username,groupid,time) values('$userid','$username','$groupid','$time')";
mysqli_query($link,$query);

//获取更新过的在线用户表
$query="select username from onlineuser WHERE groupid='$groupid'";
$result=mysqli_query($link,$query);

//从结果中获得数据
//$onlineuser_array=mysqli_fetch_all($result,1);
$onlineuser_name=array();
while ($onlineuser=mysqli_fetch_assoc($result)){
    $onlineuser_name[]=$onlineuser['username'];
}

//获取小组的教师
$query="SELECT classid FROM account WHERE userid='$userid' limit 1";
$ret=mysqli_query($link,$query);
$classid_array=mysqli_fetch_assoc($ret);
$tutor_classid=$classid_array['classid'];
$query="SELECT username FROM account WHERE classid='$tutor_classid' AND role='tutor' LIMIT 1";
$ret=mysqli_query($link,$query);
$tutor_name_array=mysqli_fetch_assoc($ret);
$tutor_name=$tutor_name_array['username'];

//获取小组全部学生成员
$query="SELECT username FROM account WHERE groupid='$groupid'";
$ret=mysqli_query($link,$query);


//整理所有信息存入$info_array
$info_array=array();
$info_array['student_name']=array();
while($stu_name=mysqli_fetch_assoc($ret)){
    $info_array['student_name'][]=$stu_name['username'];
}
$info_array['tutor_name']=$tutor_name;
$info_array['onlineuser_name']=$onlineuser_name;
//回显json格式的结果
if(!empty($info_array)) {
    echo json_encode($info_array);
}



