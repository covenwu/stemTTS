<?php
/*
 * 功能：重置数据库，设置测试用的初值
 * 接口变量：1.选择数据库
 *
 *           */
//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');

//选择数据库
mysqli_query($link,'use database2');

$query="drop database database2;";
mysqli_query($link,$query);
$query="create database database2;";
mysqli_query($link,$query);
$query="create table account(
userid int not null primary key auto_increment,							
password varchar(20) not null, 
username varchar(10) not null,											
classid varchar(30) ,														
groupid int ,															
role enum('admin','tutor','student') not null,							
emailaddress varchar(50) unique,										
)charset utf8;";
mysqli_query($link,$query);
echo("success");