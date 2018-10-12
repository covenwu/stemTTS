<?php
//-----------------获取接口变量----------------------------------------------
$classid = $_GET['classid'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use database1');

$query = "UPDATE account SET classid=0,groupid=0 WHERE classid='$classid'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('move student to 0,0 failed!');
    exit();
}
$query = "DELETE FROM group_attr WHERE classid='$classid'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('delete group_attr failed!');
    exit();
}
$query ="DELETE FROM classinfo WHERE classid='$classid'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('delete classinfo failed!');
    exit();
}
mysqli_close($link);

echo('success!');


