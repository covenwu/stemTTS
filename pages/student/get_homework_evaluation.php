<?php

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid = $_SESSION['userid'];
$taskidnow = $_SESSION['taskidnow'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use database1');

//查询当前学生当前作业的评价状态
$query = "SELECT evaluation FROM homework_history WHERE userid='$userid' AND taskid='$taskidnow' limit 1";
$ret = mysqli_query($link, $query);
mysqli_close($link);
$evaluation_array = mysqli_fetch_assoc($ret);
$evaluation = $evaluation_array['evaluation'];
//无此条作业记录为‘未提交’
if ($evaluation == NULL) {
    echo(json_encode('未提交'));
} //返回查询的评价字段
else {
    echo(json_encode($evaluation));
}

