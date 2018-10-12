<?php
//-----------------获取接口变量----------------------------------------------
$userid=$_GET['userid'];

//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';


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

