//更新并返回在线用户表
/*
1.在线用户表只记录用户id和访问本文件的时间戳，每次本文件被访问会将最近一次访问据当前时间超过一段时间的用户从表中删除，然后返回
表中的所有用户id。
2.如果以后要只返回小组内的在线列表，增加gruopid字段即可
*/

<?php
//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');

//选择数据库
mysqli_query($link,'use database1');


//获取前端传递的变量
$id=$_GET["id"];
//获取time
$time=date('Y-m-d H:i:s',time());

//删除离线用户
$query="delete from onlineuser where (GETDATE() - TIMESTAMP) > 60";
mysqli_query($link,$query);

//将请求这个文件的用户写入记录
//先删除这个用户的旧记录
$query="delete from onlineuser where id='$id'";
mysqli_query($link,$query);
//写入新记录
$query="insert into onlineuser(id,time) values('$id','$time')";
mysqli_query($link,$query);

//获取更新过的在线用户表
$query="select id from onlineuser";
$result=mysqli_query($link,$query);

//从结果中获得数据
$row=mysqli_fetch_all($result,1);
//回显json格式的结果
if(!empty($row)) {
    echo json_encode($row);

}
//echo (1);



