<?php
//-----------------获取接口变量----------------------------------------------
$userid=$_GET['userid'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use database1');

$qry="UPDATE account SET classid=0,groupid=0 WHERE  userid='$userid'";
$ret=mysqli_query($link,$qry);
mysqli_close($link);
if($ret){
    echo("success!");
}

