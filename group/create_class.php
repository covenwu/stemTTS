<?php
//-----------------控制台----------------------------------------------
$groupnum=4;

//-----------------获取接口变量----------------------------------------------
$classid=$_GET['classid'];
$classname=$_GET['classname'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use database1');
//在group_attr表添加班级的小组信息
for($i=1;$i<=$groupnum;$i++){
    $query="INSERT INTO group_attr(classid,groupid) VALUES ('$classid','$i')";
    $ret=mysqli_query($link,$query);
    if(!$ret){
        echo('error1');
        break;
    }
}
//在classinfo添加班级信息
$query="INSERT INTO classinfo(classid,classname) VALUES ('$classid','$classname')";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo('error2');
}
//在classinfo添加班级信息
mysqli_close($link);
echo ('success!');