<?php
header("Content-Type:application/json");

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid = $_SESSION['userid'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
mysqli_query($link, 'use database1');

$query="SELECT url FROM log WHERE userid='$userid'AND url is not null";
$ret = mysqli_query($link, $query);

mysqli_close($link);
/*
while ($rst = mysqli_fetch_assoc($ret)) {
    $homework_array[] = $rst;
}
*/
while ($rst = mysqli_fetch_assoc($ret)) {
    $url=$rst['url'];
    $str=explode(",",$url);
    $str = array_filter($str);
    foreach ($str as $key => $value){
        $homework_array[]['url'] = $value;

    }
}


//回显json格式的结果
if (!empty($homework_array)) {
    echo json_encode($homework_array);
}
