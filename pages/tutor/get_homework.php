<?php

$group_num=4;

//header("Content-Type:application/json");
$sid=$_GET['sid'];
session_id($sid);
session_start();

$homework=array();
//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//选择数据库
mysqli_query($link,'use database1');
for($i=1;$i<$group_num;$i++){
    $query="SELECT * FROM homework_history WHERE groupid='$groupid'";
    $ret=mysqli_query($link,$query);
    while($data=mysqli_fetch_assoc($ret)){
        $homework[]=$data;
    }
}
mysqli_close($link);
echo (json_encode($homework));
