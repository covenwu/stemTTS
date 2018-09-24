<?php

require 'project1.php';

$p=$_POST['p'];
$q=$_POST['q'];

$url='';
$urlname='';

//给出数据
//$file=$_FILES['image'];
$path='../upload';
$max_size=200000000;
$allow_type=array('image/jpg','image/jpeg','image/gif');
$allow_format=array('jpg','jpeg','gif');
$error='no error';

$i=0;
if($q=='saveResources'){
  //  deleteAll($p,'resources');
  //  echo $_GET['name1'];
    $num=explode(',', $_POST['num']);//将字符串以!分割为一个一维数组,参数一不可以为""
print_r($num);
 /*   for(;;$i++){
        if(!$_GET['name'.$i])break;
    }//计算有几个resource
/*    for($j=1;$j<$i;$j++){//对每个resource进行保存
        saveResource($p,$j,$_GET['name'.$j],$_GET['file'.$j]);
        saveResource($p,$j,$_GET['name'.$j],$_GET['file'.$j]);
    }
*/
}
$pathArray;
$k=1;
foreach ($_FILES as $key => $value){
    $file=$value;
    $temp=$path.'/'.upload_single($file,$allow_type,$allow_format,$error,$path,$max_size);

    $pathArray[$k]=$temp;
$k++;
}

for($j=1;$j<=$num[0];$j++){//对每个resourse进行保存
    $i=$num[$j];
    saveResource($p,$i,$_POST['name'.$i],$pathArray[$j]);
}

function upload_single($file,$allow_type,$allow_format=array(),$error,$path,$max_size){
    //判断文件是否有效
    //把传过来的文件放进￥path里，并返回文件名
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



