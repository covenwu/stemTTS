<?php
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use database1');

$query="SELECT userid,username,classid,groupid,numberingroup FROM account WHERE role='student'";
$ret_stu=mysqli_query($link,$query);
$query="SELECT classid,classname FROM classinfo ORDER BY classid";
$ret_classinfo=mysqli_query($link,$query);
mysqli_close($link);
$info=[];
$info['stu']=[];
$info['classinfo']=[];
while($res=mysqli_fetch_assoc($ret_stu)){
    $info['stu'][]=$res;
}
//班级信息索引从0开始
while($res=mysqli_fetch_assoc($ret_classinfo)){
    $info['classinfo'][]=$res;
}
echo(json_encode($info));