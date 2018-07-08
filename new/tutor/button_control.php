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
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');
//联合查询作业状态数据
$query="SELECT taskid,evaluation,groupid,numberingroup FROM account INNER JOIN homework_mood ON account.userid=homework_mood.userid WHERE account.classid='$classid'";
$ret=mysqli_query($link,$query);
$query="SELECT groupid,taskidnow FROM group_attr WHERE classid='$classid' ORDER BY groupid";
$ret_taskid=mysqli_query($link,$query);
mysqli_close($link);
$homeworkmood=[];
while ($rst = mysqli_fetch_assoc($ret)) {
    $homeworkmood[] = $rst;
}
$taskid_arr=[];
while ($rst = mysqli_fetch_assoc($ret_taskid)) {
    $taskid_arr[] = $rst;
}
$info=[];
$info['homeworkmood']=$homeworkmood;
$info['taskid']=$taskid_arr;
echo(json_encode($info));