<?php

//-----------------常量设置----------------------------------------------
//教师对应小组数
$group_num = 4;
$taskemailnum;

//-----------------获取接口变量----------------------------------------------

$sid = $_GET['sid'];
session_id($sid);
session_start();
$classid = $_GET['classid'];
$tutorid = $_SESSION['tutorid'];

//-----------------mysql参数----------------------------------------------
$servername = "47.96.146.26";
$usern = "root";
$passw = "B4F393c91945";
$dbname = "mysql";
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect($servername, $usern, $passw);;
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use ' . $dbname);

//联合查询作业状态数据
$query = "SELECT taskid,evaluation,groupid,numberingroup FROM account INNER JOIN homework_mood ON account.userid=homework_mood.userid WHERE account.classid='$classid'";
$ret = mysqli_query($link, $query);
$query = "SELECT groupid,taskidnow FROM group_attr WHERE classid='$classid' ORDER BY groupid";
$ret_taskid = mysqli_query($link, $query);

$homeworkmood = [];
while ($rst = mysqli_fetch_assoc($ret)) {
    $homeworkmood[] = $rst;
}
$taskid_arr = [];
while ($rst = mysqli_fetch_assoc($ret_taskid)) {
    $taskid_arr[] = $rst;
}

$info = [];
$info['pro'] = $pro;
$info['homeworkmood'] = $homeworkmood;
$info['taskid'] = $taskid_arr;

echo(json_encode($info));
