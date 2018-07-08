<?php

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
mysqli_query($link, 'use database1');

$query="SELECT url,urlname,timeStamp,shared,taskid FROM report WHERE userid='$userid'";
$ret=mysqli_query($link,$query);
mysqli_close($link);
$info=[];
$info['urlname']=[];
$info['url']=[];
$info['time']=[];
$info['shared']=[];
//记录对应文件是同一个report的第几个附件,第一个为0
$info['number']=[];
$info['taskid']=[];
$url_arr=[];
$urlname_arr=[];
$shared_arr=[];
while($res=mysqli_fetch_assoc($ret)){
    $url_arr=explode(',',$res['url']);
    //echo ($res['url']);
    $url_arr=array_filter($url_arr);
    foreach ($url_arr as $value){
        $info['url'][]=$value;
    }
    $shared_arr=explode(',',$res['shared']);
    $shared_arr=array_filter($shared_arr,"shared");
    foreach ($shared_arr as $value){
        $info['shared'][]=$value;
    }

    $urlname_arr=explode('@!',$res['urlname']);
    $urlname_arr=array_filter($urlname_arr);
    $num=0;
    foreach ($urlname_arr as $value){
        $info['urlname'][]=$value;
        $info['time'][]=$res['timeStamp'];
        $info['number'][]=$num;
        $num++;
        $info['taskid'][]=$res['taskid'];
    }
}
function shared($var){
    if($var!=''){
        return true;
    }
    else{
        return false;
    }
}
echo(json_encode($info));


