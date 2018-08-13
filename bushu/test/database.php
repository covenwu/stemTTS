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

$query="SELECT *FROM account";
$ret=mysqli_query($link,$query);
if(!$ret){
    print_r('error 1');
}
$ac_arr=[];
while($res=mysqli_fetch_assoc($ret)){
    //$ac_arr[]=$res;
    print_r($res);
    print_r('<br>');
}
//print_r($ac_arr);
print_r('<br>');

$query="SELECT *FROM group_attr";
$ret=mysqli_query($link,$query);
if(!$ret){
    print_r('error 2');
}
$ac_arr=[];
while($res=mysqli_fetch_assoc($ret)){
    print_r($res);
    print_r('<br>');
}
print_r('<br>');

$query="SELECT *FROM homework_mood";
$ret=mysqli_query($link,$query);
if(!$ret){
    print_r('error 3');
}
$ac_arr=[];
while($res=mysqli_fetch_assoc($ret)){
    print_r($res);
    print_r('<br>');
}
print_r('<br>');

$query="SELECT *FROM report";
$ret=mysqli_query($link,$query);
if(!$ret){
    print_r('error 4');
}
$ac_arr=[];
while($res=mysqli_fetch_assoc($ret)){
    print_r($res);
    print_r('<br>');
}
print_r('<br>');
mysqli_close($link);