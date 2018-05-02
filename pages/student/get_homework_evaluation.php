<?php

//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];
$taskidnow=$_SESSION['taskidnow'];

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//选择数据库
mysqli_query($link,'use database1');

$query="SELECT evaluation FROM homework_history WHERE userid='$userid' AND taskid='$taskidnow' limit 1";
$ret=mysqli_query($link,$query);
$evaluation_array=mysqli_fetch_assoc($ret);
$evaluation=$evaluation_array['evaluation'];
if($evaluation==NULL){
    echo(json_encode('未提交'));

}
else{
    echo(json_encode($evaluation));
}

