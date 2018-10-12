<?php

//-----------------常量设置----------------------------------------------
//教师对应小组数
$group_num=4;

//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$classid=$_GET['classid'];

//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';


//联合查询作业状态数据
$query="SELECT taskid,evaluation,groupid,numberingroup FROM account INNER JOIN homework_mood ON account.userid=homework_mood.userid WHERE account.classid='$classid'";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo 'err 1';
    exit();
}
$query="SELECT groupid,taskidnow FROM group_attr WHERE classid='$classid' ORDER BY groupid";
$ret_taskid=mysqli_query($link,$query);
if(!$ret_taskid){
    echo 'err 2';
    exit();
}
//查询班级是否自动发送消息
$query="SELECT autosend FROM classinfo WHERE classid='$classid'";
$ret_auto=mysqli_query($link,$query);
if(!$ret_auto){
    echo 'err 3';
    exit();
}
mysqli_close($link);
$homeworkmood=[];
while ($rst = mysqli_fetch_assoc($ret)) {
    $homeworkmood[] = $rst;
}
$taskid_arr=[];
while ($rst = mysqli_fetch_assoc($ret_taskid)) {
    $taskid_arr[] = $rst;
}
$rst = mysqli_fetch_assoc($ret_auto);
$autosend=$rst['autosend'];
$info=[];
$info['homeworkmood']=$homeworkmood;
$info['taskid']=$taskid_arr;
$info['autosend']=$autosend;
echo(json_encode($info));