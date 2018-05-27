<?php

$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];
$classid=$_SESSION['classid'];
$groupid=$_SESSION['groupid'];

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');

//取得当前taskid，为防止taskid变动，不保存在session中，每次现查
$query="SELECT taskidnow FROM group_attr WHERE classid='$classid' AND groupid='$groupid' limit 1";
$ret=mysqli_query($link,$query);
$taskid_arr=mysqli_fetch_assoc($ret);
$taskidnow=$taskid_arr['taskidnow'];

//查询当前任务是否已有草稿记录
$query="SELECT userid,content FROM log WHERE userid=$userid AND taskid='$taskidnow' AND actiontype='EditReport' limit 1";
$ret=mysqli_query($link,$query);
$result=mysqli_fetch_assoc($ret);
if($result){
    mysqli_close($link);
    $draft=$result['content'];
    echo (json_encode($draft));

}
else{
    mysqli_close($link);
    echo(json_encode(''));
}
exit();