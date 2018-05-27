<?php
//此处不能加header
//header("Content-Type:application/json");

//-----------------获取接口变量----------------------------------------------

$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid = $_SESSION['userid'];
//$groupid=$_SESSION['groupid'];
//-----------------连接mysql服务器----------------------------------------------

$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
mysqli_query($link, 'use database1');

$query="SELECT timeStamp,content FROM log WHERE timeStamp IN (SELECT max(timeStamp) FROM log WHERE userid='$userid' AND actiontype='ReportSubmit' GROUP BY taskid)";
$ret = mysqli_query($link, $query);

mysqli_close($link);

while ($rst = mysqli_fetch_assoc($ret)) {
    $homework_array[] = $rst;
}




//回显json格式的结果
if (!empty($homework_array)) {
    echo json_encode($homework_array);
}
else{
    $str='noresult';
    echo(json_encode($str));
}




