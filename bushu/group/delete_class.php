<?php
//-----------------获取接口变量----------------------------------------------
$classid = $_GET['classid'];

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

/*
$query = "UPDATE account SET classid=0,groupid=0 WHERE classid='$classid'AND role='student'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('move student to 0,0 failed!');
    exit();
}
*/
$query="SELECT userid FROM account WHERE classid='$classid' AND role='student'";
$ret_userid=mysqli_query($link,$query);
while($userid_ar=mysqli_fetch_assoc($ret_userid)){
    $userid=$userid_ar['userid'];
    resetStu($userid,$link);
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

$query ="DELETE FROM account WHERE classid='$classid'AND role='tutor'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('error 1');
    exit();
}

$query ="DELETE FROM report WHERE classid='$classid'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('error 2');
    exit();
}

$query ="DELETE FROM chat WHERE classid='$classid'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('error 3');
    exit();
}
mysqli_close($link);

echo('success!');


function resetStu($userid,$link){
    $qry="UPDATE account SET classid=0,groupid=0 WHERE  userid='$userid'";
    $ret=mysqli_query($link,$qry);
    if(!$ret){
        echo ('error 4');
    }
    $query="DELETE  FROM task WHERE userid='$userid'";
    $ret=mysqli_query($link,$query);
    if(!$ret){
        echo ('error 5');
    }

    $query="DELETE  FROM homework_mood WHERE userid='$userid'";
    $ret=mysqli_query($link,$query);
    if(!$ret){
        echo ('error 6');
    }

    $query="DELETE FROM report WHERE userid='$userid'";
    $ret=mysqli_query($link,$query);
    if(!$ret){
        echo ('error 7');
    }

    $query="DELETE FROM feedback WHERE userid='$userid'";
    $ret=mysqli_query($link,$query);
    if(!$ret){
        echo ('error 8');
    }
}

