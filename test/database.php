<?php
//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';


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


$query="SELECT *FROM classinfo";
$ret=mysqli_query($link,$query);
if(!$ret){
    print_r('error 5');
}
$ac_arr=[];
while($res=mysqli_fetch_assoc($ret)){
    print_r($res);
    print_r('<br>');
}
print_r('<br>');

$query="SELECT *FROM group_attr";
$ret=mysqli_query($link,$query);
if(!$ret){
    print_r('error 6');
}
$ac_arr=[];
while($res=mysqli_fetch_assoc($ret)){
    print_r($res);
    print_r('<br>');
}
print_r('<br>');
mysqli_close($link);