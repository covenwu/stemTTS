<?php
//-----------------控制台----------------------------------------------
$groupnum=4;

//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$classid=$_GET['classid'];
$classname=$_GET['classname'];
$autosend=$_GET['autosend'];
$userid=$_SESSION['userid'];
$password=$_SESSION['password'];
$emailaddress=$_SESSION['emailaddress'];
$role='tutor';
$tutorid=$_SESSION['tutorid'];
$username=$_SESSION['username'];

//设置时区保证时间戳正确
date_default_timezone_set('PRC');
$time=date('Y-m-d H:i:s',time());

//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';


//向账号表插入教师
$query="INSERT INTO account(username,password,emailaddress,role,tutorid,classid) VALUES('$username','$password','$emailaddress','$role','$tutorid','$classid')";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 1');

    exit();
}
//在group_attr表添加班级的小组信息
for($i=1;$i<=$groupnum;$i++){
    $query="INSERT INTO group_attr(classid,groupid) VALUES ('$classid','$i')";
    $ret=mysqli_query($link,$query);
    if(!$ret){
        echo('error 2');
        break;
    }
}
//在classinfo添加班级信息
$query="INSERT INTO classinfo(classid,classname,autosend) VALUES ('$classid','$classname','$autosend')";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo('error 3');
    echo $autosend;
}

//在chat添加第一个任务的预订语
if($autosend=='1'){
    $xml = simplexml_load_file('pro.xml');
    for ($i = 0; $i < 1; $i++) {
        $task = $xml->task[$i];
        $chats = $task->chats;
        $num = count($chats->children());
        for ($k = 0; $k < $num; $k++) {
            $chatmsg= (string)$chats->chat[$k]->chatMsg;
            for ($j=1;$j<=$groupnum;++$j){
                $query="INSERT INTO chat(timeStamp,classid,groupid,username,content) VALUES('$time','$classid','$j','$username','$chatmsg')";
                $ret=mysqli_query($link,$query);
                if(!$ret){
                    echo 'error 4';
                    exit();
                }
            }
        }
    }
}


mysqli_close($link);
echo ('success!');