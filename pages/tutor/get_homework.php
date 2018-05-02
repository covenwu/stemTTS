<?php
//header("Content-Type:application/json");

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');

$sid=$_GET['sid'];
session_id($sid);
session_start();
//选择数据库
mysqli_query($link,'use database1');
$homework=array();

for($i=0;$i<4;$i++){
    $groupid=$_SESSION['group'.$i];
    $query="SELECT * FROM homework_history WHERE groupid='$groupid'";
    $ret=mysqli_query($link,$query);
    while($data=mysqli_fetch_assoc($ret)){
        $homework[]=$data;
    }
}

echo (json_encode($homework));
//echo(1);
