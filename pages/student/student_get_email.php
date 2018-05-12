<?php
/*
功能：1.返回学生页面的邮件列表
接口：1.session
    2.sid
*/
/*
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
//查询数据
$query = "select time,classid,emailcontent from email_history where userid='$userid'";
$result = mysqli_query($link, $query);
//从结果中获得数据
$email_array = mysqli_fetch_all($result, 1);
//查询邮件内容
$query = "SELECT emailcontent FROM task_email WHERE taskid='$taskidnow'";
$ret = mysqli_query($link, $query);
mysqli_close($link);
$taskemail_array = mysqli_fetch_assoc($ret);
$email_array[]['emailcontent'] = $taskemail_array['emailcontent'];
//回显json格式的结果
if (!empty($email_array)) {
    echo json_encode($email_array);
}

*/

header("Content-Type:application/json");

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid = $_SESSION['userid'];
$classid=$_SESSION['classid'];
$groupid=$_SESSION['groupid'];
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
mysqli_query($link, 'use database1');

$query="SELECT timeStamp,taskid,content,actiontype FROM log WHERE (userid='$userid' AND actiontype='ReportFeedback') OR (actiontype='TaskEmail' AND classid='$classid' AND groupid='$groupid')";
$ret = mysqli_query($link, $query);
mysqli_close($link);
while ($rst = mysqli_fetch_assoc($ret)) {
    $email_array[] = $rst;
}
//回显json格式的结果
if (!empty($email_array)) {
    echo json_encode($email_array);
}
