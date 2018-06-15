<?php

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$groupid = $_SESSION['groupid'];
$classid=$_SESSION['classid'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
mysqli_query($link, 'use database1');

$query="SELECT sharefile,filename,sharetime FROM group_attr WHERE classid='$classid' AND groupid='$groupid'  limit 1";
$ret=mysqli_query($link,$query);
mysqli_close($link);
$info=[];
$info['filename']=[];
$info['sharefile']=[];
$info['sharetime']=[];

$res=mysqli_fetch_assoc($ret);
$info['filename']=explode('@!',$res['filename']);
$info['filename']=array_filter($info['filename']);
$info['sharetime']=explode(',',$res['sharetime']);
$info['sharetime']=array_filter($info['sharetime']);
$info['sharefile']=explode(',',$res['sharefile']);
$info['sharefile']=array_filter($info['sharefile']);


echo(json_encode($info));
