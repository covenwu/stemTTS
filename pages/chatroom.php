/*
1.在线用户列表待开发
*/

<?php
// 获得最新的聊天信息
//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');

//选择数据库
mysqli_query($link,'use database1');

$maxId = $_GET['maxId'];

// 防止获取重复数据，本次请求的记录结果id要大于上次获得的id
$query = "select * from message where id >"."'$maxId'";
$qry = mysqli_query($link,$query);

$info = array();
while($rst =mysqli_fetch_assoc($qry)){
    $info[] = $rst;
}

// 通过json格式给客户端提供数据
echo json_encode($info);



?>