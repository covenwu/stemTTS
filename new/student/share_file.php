<?php
/*
功能：1.学生提交作业的后台处理
接口：1.从$_GET和$_SESSION,sid,见下方源代码‘获取接口变量’部分
        2.homework_history表
提示：有可移至前端完成的查询
*/

header('content-type:text/html;charset=utf-8');

//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//-----------------测试用----------------------------------------------
/*
$classid=1;
$groupid=1;
*/
//-----------------获取接口变量----------------------------------------------

$sid=$_POST['sid'];
session_id($sid);
session_start();
$classid=$_SESSION['classid'];
$groupid=$_SESSION['groupid'];
$sharefile_str='';
$sharetime_str='';
$filename_str='';
//给出数据
//$file=$_FILES['image'];
$path='../upload';
$max_size=200000000;
$allow_type=array('image/jpg','image/jpeg','image/gif');
$allow_format=array('jpg','jpeg','gif');
$error='no error';




//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');
//-----------------对应插入新纪录---------------------------------------------
$qurey="SELECT sharefile,sharetime,filename FROM group_attr WHERE classid='$classid' AND groupid='$groupid' limit 1";

$ret=mysqli_query($link,$qurey);
$share_arr=[];
while($share_arr=mysqli_fetch_assoc($ret)) {
    $sharefile_str = $share_arr['sharefile'];
    $sharetime_str = $share_arr['sharetime'];
    $filename_str = $share_arr['filename'];
}
/*
$share_arr=mysqli_fetch_assoc($ret);
$sharefile_str=$share_arr[0]['sharefile'];
$sharetime_str=$share_arr[0]['sharetime'];
$filename_str=$share_arr[0]['filename'];*/

foreach ($_FILES as $key => $value){
    $file=$value;
    if($file['name']==''){
        continue;
    }
    $filename_str.=$file['name'].'@!';
    $sharefile_str.='../upload/'.upload_single($file,$allow_type,$allow_format,$error,$path,$max_size).',';
    $sharetime_str.=date('Y-m-d H:i:s',time()).',';
}

$query="UPDATE group_attr SET sharefile='$sharefile_str',sharetime='$sharetime_str',filename='$filename_str' WHERE classid='$classid' AND groupid='$groupid' limit 1" ;
mysqli_query($link,$query);


mysqli_close($link);
//将字符串打散成数组
$filename_arr=explode('@!',$filename_str);
$filename_arr = array_filter($filename_arr);

$sharefile_arr=explode(',',$sharefile_str);
$sharefile_arr = array_filter($sharefile_arr);

$sharetime_arr=explode(',',$sharetime_str);
$sharetime_arr = array_filter($sharetime_arr);

$info=[];
$info['filename']=$filename_arr;
$info['sharefile']=$sharefile_arr;
$info['sharetime']=$sharetime_arr;
echo(json_encode($info));


function upload_single($file,$allow_type,$allow_format=array(),$error,$path,$max_size){
    //判断文件是否有效
    //if(is_uploaded_file($file))
    if(!is_array($file)||!isset($file['error'])){
        $error='不是一个有效的上传文件';
        return false;
    }
    //判断存储路径是否有效
    if(!is_dir($path)){
        $error='上传路径不存在';
        return false;
    }
    //判断上传过程是否出错
    switch ($file['error']){
        case 1:
        case 2:
            $error='文件超出服务器大小';
            return false;
        case 3:
            $error='文件上传过程中出现问题 只上传了一部分';
            return false;
        case 4:
            $error='用户没有选择上传的文件';
            return false;
        case 6:
        case 7:
            $error='文件保存失败';
            return false;
    }
    //检查mime类型是否正确
    /*if (!in_array($file['type'],$allow_type)){
        $error='当前文件类型不允许上传';
        return false;
    }*/
    //检查文件扩展名
    $ext=ltrim(strrchr($file['name'],'.'),'.');
    /*if (empty($allow_format) && !in_array($ext,$allow_format)){
        $error='当前文件格式不允许上传';
        return false;
    }*/
    //构建文件名
    $fullname=strstr($file['name'],'/','true').date('Ymd');
    for ($i=0;$i<4;$i++){
        $fullname.=chr(mt_rand(65,90));
        $fullname.='.'.$ext;
    }
    //判断文件大小
    if($file['size']>$max_size){
        $error='上传文件过大';
        return false;
    }
    //移动文件
    if(!is_uploaded_file($file['tmp_name'])) {
        echo '不是上传文件';
        return false;
    }
    if (!move_uploaded_file($file['tmp_name'],$path.'/'.$fullname)){
        echo '文件移动失败';
        return false;
    }
    //echo 'upload succeed';
    return($fullname);
}



