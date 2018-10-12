<?php

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid = $_SESSION['userid'];
$groupid = $_SESSION['groupid'];
$classid=$_SESSION['classid'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
mysqli_query($link, 'use database1');

//查询当前taskid
$query="SELECT taskidnow FROM group_attr WHERE classid='$classid' AND groupid='$groupid' limit 1";
$ret=mysqli_query($link,$query);
$taskid_arr=mysqli_fetch_assoc($ret);
$taskidnow=$taskid_arr['taskidnow'];

//查询当前学生当前作业的评价状态
//$query = "SELECT evaluation FROM homework_history WHERE userid='$userid' AND taskid='$taskidnow' limit 1";
$query="SELECT evaluation FROM homework_mood WHERE userid='$userid' AND taskid='$taskidnow' limit 1";
$ret = mysqli_query($link, $query);
$evaluation_array = mysqli_fetch_assoc($ret);
$evaluation = $evaluation_array['evaluation'];
//无此条作业记录为‘未提交’
//仅适用于第一个report,第一个report的homework——mood在此处插入记录，之后的在小组通过时为全组插入‘未提交’
if ($evaluation == NULL) {
    $query="INSERT INTO homework_mood(userid,taskid,evaluation) VALUES ('$userid',1,'未提交')";
    $ret=mysqli_query($link,$query);
    if(!$ret){
        echo(json_encode('error 1:insert failed'));
    }
    mysqli_close($link);
    echo(json_encode('未提交'));
} //返回查询的评价字段
else {
    mysqli_close($link);
    echo(json_encode($evaluation));
}

