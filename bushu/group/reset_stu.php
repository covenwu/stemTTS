<?php
//-----------------获取接口变量----------------------------------------------
$userid=$_GET['userid'];

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


$qry="UPDATE account SET classid=0,groupid=0 WHERE  userid='$userid'";
$ret=mysqli_query($link,$qry);
if(!$ret){
    echo ('error 1');
}
$query="DELETE  FROM task WHERE userid='$userid'";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 2');
}

$query="DELETE  FROM homework_mood WHERE userid='$userid'";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 3');
}

$query="DELETE FROM report WHERE userid='$userid'";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 4');
}

$query="DELETE FROM feedback WHERE userid='$userid'";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 5');
}



mysqli_close($link);


if($ret){
    echo("success!");
}

