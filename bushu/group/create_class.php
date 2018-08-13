<?php
//-----------------控制台----------------------------------------------
$groupnum=4;

//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$classid=$_GET['classid'];
$classname=$_GET['classname'];
$userid=$_SESSION['userid'];
$password=$_SESSION['password'];
$emailaddress=$_SESSION['emailaddress'];
$role='tutor';
$tutorid=$_SESSION['tutorid'];
$username=$_SESSION['username'];

//-----------------mysql参数----------------------------------------------
$servername = "47.96.146.26";
$usern = "root";
$passw = "B4F393c91945";
$dbname = "mysql";
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect($servername,$usern ,$passw);;
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use '.$dbname);


//向账号表插入教师
$query="INSERT INTO account(username,password,emailaddress,role,tutorid,classid) VALUES('$username','$password','$emailaddress','$role','$tutorid','$classid')";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 1');

    exit();
}
//在group_attr表添加班级的小组信息
for($i=1;$i<=$groupnum;$i++){
    $query="INSERT INTO group_attr(classid,groupid) VALUES ('$classid','$i')";
    $ret=mysqli_query($link,$query);
    if(!$ret){
        echo('error 2');
        break;
    }
}
//在classinfo添加班级信息
$query="INSERT INTO classinfo(classid,classname) VALUES ('$classid','$classname')";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo('error2');
}
//在classinfo添加班级信息
mysqli_close($link);
echo ('success!');