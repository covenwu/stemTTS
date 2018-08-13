<?php
//-----------------mysql参数----------------------------------------------
$servername = "47.96.146.26";
$usern = "root";
$passw = "B4F393c91945";
$dbname = "mysql";
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect($servername,$usern ,$passw);;
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use '.$dbname);

$query="SELECT userid,username,classid,groupid,numberingroup FROM account WHERE role='student'";
$ret_stu=mysqli_query($link,$query);
if(!$ret_stu){
    echo('error1');
}
$query="SELECT classid,classname FROM classinfo ORDER BY classid";
$ret_classinfo=mysqli_query($link,$query);
if(!$ret_classinfo){
    echo('error2');
}
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