<?php
/*
功能：1.更新并返回在线用户表
接口：1.$_SESSION,见下方源代码‘获取接口变量'部分
提示：1.在线用户表只记录用户id和访问本文件的时间戳，每次本文件被访问会将最近一次访问据当前时间超过一段时间的用户从表中删除，然后返回
表中的所有用户id。
*/

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

/*
$values_str='';
for($i=1;$i<=$groupnum-1;$i++){
    $values_str.='(\'$userid\',\'$username\','.(string)$i.',\'$time\',\'$classid\'),';
}
$values_str.='(\'$userid\',\'$username\','.(string)$groupnum.',\'$time\',\'$classid\')';
*/
//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//选择数据库
mysqli_query($link,'use database1');
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
/*
//获取更新过的在线用户表
$query="select userid,username from onlineuser WHERE groupid='$groupid'";
$result=mysqli_query($link,$query);
mysqli_close($link);
//从结果中获得数据
$row=mysqli_fetch_all($result,1);
//回显json格式的结果
if(!empty($row)) {
    echo json_encode($row);
}
*/
echo('update online user successfully');

