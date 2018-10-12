<?php
//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';

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