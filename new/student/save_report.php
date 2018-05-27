<?php

header('content-type:text/html;charset=utf-8');

//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$text=$_GET["text"];
$userid=$_SESSION['userid'];
$classid=$_SESSION['classid'];
$username=$_SESSION['username'];
$time=date('Y-m-d H:i:s',time());
$groupid=$_SESSION['groupid'];
$numberingroup=$_SESSION['numberingroup'];

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');
//-----------------对应插入新纪录---------------------------------------------
//取得当前taskid，为防止taskid变动，不保存在session中，每次现查
$query="SELECT taskidnow FROM group_attr WHERE classid='$classid' AND groupid='$groupid' limit 1";
$ret=mysqli_query($link,$query);
$taskid_arr=mysqli_fetch_assoc($ret);
$taskidnow=$taskid_arr['taskidnow'];

//查询当前任务是否已有草稿记录
$query="SELECT userid FROM log WHERE userid=$userid AND taskid='$taskidnow' AND actiontype='EditReport'";
$ret=mysqli_query($link,$query);
$result=mysqli_fetch_assoc($ret);
if($result){
    $query="UPDATE log SET content='$text',timeStamp='$time' WHERE userid='$userid' AND taskid='$taskidnow' AND actiontype='EditReport'";
    mysqli_query($link,$query);
}else{
    //插入记录到log
    $query="INSERT INTO log(timeStamp,classid,groupid,groupNO,userid,username,actiontype,taskid,content) VALUES ('$time','$classid','$groupid','$numberingroup'
          ,'$userid','$username','EditReport','$taskidnow','$text')";
    mysqli_query($link,$query);
}


mysqli_close($link);

echo(json_encode('保存草稿success'));