<?php
//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//-----------------获取接口变量----------------------------------------------

$userid=$_GET['userid'];
$classid=$_GET['classid'];
$groupid=$_GET['groupid'];
$numberingroup=$_GET['numberingroup'];
$time=date('Y-m-d H:i:s',time());


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



$qry="UPDATE account SET classid='$classid',groupid='$groupid',numberingroup='$numberingroup' WHERE userid='$userid'";
$ret=mysqli_query($link,$qry);
if(!$ret){
    echo('error 1');
}

$query="INSERT INTO task VALUES ('$userid','$time',0);";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 3');
}

$query="INSERT INTO homework_mood VALUES ('$userid',1,'未提交');";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 5');
}



mysqli_close($link);
echo('success!');