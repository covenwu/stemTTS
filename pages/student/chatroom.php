<?php
/*
功能：1.获取之前未获取的聊天信息
接口：1.$_GET['maxId']
        2.$_SESSION['groupid']
        3.sid
待办：1.在线用户列表待开发
        2.$groupid动态获取
*/
//-----------------测试用----------------------------------------------

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use database1');

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
$maxId = $_GET['maxId'];
session_id($sid);
session_start();
$groupid = $_SESSION['groupid'];

// 防止获取重复数据，本次请求的记录结果id要大于上次获得的id
$query = "select * from message where messageid >'$maxId'AND groupid='$groupid'";
$qry = mysqli_query($link, $query);
mysqli_close($link);
$info = array();
while ($rst = mysqli_fetch_assoc($qry)) {
    $info[] = $rst;
}

// 通过json格式给客户端提供数据
echo json_encode($info);



