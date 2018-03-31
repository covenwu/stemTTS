<?php
/*
功能：1.判断登录是否成功
      2.根据'记住我'选项设置cookie保存邮箱
接口:1.需要获得$_POST['emailaddress']，$_POST['password']，$_POST['remember']
    2.登录成功时跳转到loginsucc.php
    3.登录失败时跳转回login.php并用$_GET['err']传递错误码
 */
header("content-type:text/html;charset=utf-8");
//声明变量
$emailaddress = isset($_POST['emailaddress'])?$_POST['emailaddress']:"";
$password = isset($_POST['password'])?$_POST['password']:"";
$remember = isset($_POST['remember'])?$_POST['remember']:"";
//判断用户名和密码是否为空
if(!empty($emailaddress)&&!empty($password)) {
    //建立连接
    $link =mysqli_connect('localhost:3306','root','12345678') ;
    $res=mysqli_set_charset($link,'utf8');
    //选择数据库
    mysqli_query($link,'use database1');
    //准备SQL语句
    $query_select = "SELECT emailaddress,password FROM account WHERE emailaddress = '$emailaddress' AND password = '$password'";
    //执行SQL语句
    $ret = mysqli_query($link,$query_select);
    $row = mysqli_fetch_array($ret);

    //判断用户名或密码是否正确
    if($emailaddress==$row['emailaddress']&&$password==$row['password']) {
        //选中“记住我”
        if($remember=="on") {
            //创建cookie
            setcookie("emailaddress", $emailaddress, time()+7*24*3600);
        }
        session_start();
        $_SESSION['emailaddress']=$emailaddress;
        //开启session

        /*$query_insert = "INSERT INTO deng(emailaddress) VALUES('$emailaddress')";
        mysqli_query($link,$query_insert);
        //日志写入文件，如实现此功能，需要创建文件目录logs        11111*/

        //跳转到loginsucc.php页面
        header("Location:loginsucc.php");
        //关闭数据库
        mysqli_close($link);
    }else {
        //用户名或密码错误，赋值err为1
        header("Location:login.php?err=1");
    }
}else {
    //用户名或密码为空，赋值err为2
    header("Location:login.php?err=2");
}

