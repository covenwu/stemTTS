<?php
/*
功能：1.返回学生页面的邮件列表
接口：1.session
    2.sid
进度：1.task信息需要独立查询
*/
//此处不能加header
//header("Content-Type:application/json");

//-----------------获取接口变量----------------------------------------------
$maxtimestamp=$_GET['maxtimestamp'];
$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid = $_SESSION['userid'];


//-----------------mysql参数----------------------------------------------
$servername = "47.96.146.26";
$usern = "root";
$passw = "B4F393c91945";
$dbname = "mysql";
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect($servername,$usern ,$passw);;
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use '.$dbname);

$query="SELECT * FROM feedback WHERE timeStamp>'$maxtimestamp' AND userid='$userid' limit 1";
$ret_feedback=mysqli_query($link,$query);

$query="SELECT timeStamp FROM task WHERE userid='$userid' limit 1";
$ret_task=mysqli_query($link,$query);

mysqli_close($link);

//把信息存储到一个数组
$info=[];
$info['feedback']=[];
$info['feedback'][0]=[];
while ($rst = mysqli_fetch_assoc($ret_feedback)) {
    $info['feedback'][0] = $rst;
}


$task=[];
while ($rst = mysqli_fetch_assoc($ret_task)) {
    $task[]= $rst;
}
$time_arr=explode(",",$task[0]['timeStamp']);
$time_arr = array_filter($time_arr);
$info['task'][0]['timeStamp']=end($time_arr);
$info['task'][0]['checked']=0;


echo json_encode($info);

