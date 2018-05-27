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
$classid=$_SESSION['classid'];
$groupid=$_SESSION['groupid'];
$email_array=[];
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
mysqli_query($link, 'use database1');

$query="SELECT timeStamp,taskid,content,actiontype,checked FROM log WHERE timeStamp>'$maxtimestamp' AND((userid='$userid' AND actiontype='ReportFeedback') OR (actiontype='TaskEmail' AND classid='$classid' AND groupid='$groupid'))";
$ret = mysqli_query($link, $query);
mysqli_close($link);
while ($rst = mysqli_fetch_assoc($ret)) {
    $email_array[] = $rst;
}

/*
$taskid=0;
$task=$xml->task[$taskid];
$kids=$task->chats->children();
$num=count($kids);
//echo($num);
for($i=0;$i<$num;$i++){
    echo($kids[$i]->chatName);
}*/

//回显json格式的结果
//$email_array[]=$pro;
if (!empty($email_array)) {
    echo json_encode($email_array);
}
else{
    echo(json_encode('noresult'));
}
