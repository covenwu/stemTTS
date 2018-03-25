<?php
header("content-type:text/html;charset=utf-8");
//声明变量
$username = isset($_POST['email'])?$_POST['email']:"";
$password = isset($_POST['password'])?$_POST['password']:"";
$remember = isset($_POST['remember'])?$_POST['remember']:"";
//判断用户名和密码是否为空
if(!empty($username)&&!empty($password)) {
    //建立连接
    $conn =mysqli_connect('localhost:3306','root','12345678') ;
    $res=mysqli_set_charset($conn,'utf8');
    //选择数据库
    mysqli_query($conn,'use database1');
    //准备SQL语句
    $sql_select = "SELECT email,password FROM account WHERE email = '$username' AND password = '$password'";
    //执行SQL语句
    $ret = mysqli_query($conn,$sql_select);

    $row = mysqli_fetch_array($ret);

    //判断用户名或密码是否正确
    if($username==$row['email']&&$password==$row['password']) {
        //选中“记住我”
        if($remember=="on") {
            //创建cookie
            setcookie("wang", $username, time()+7*24*3600);
        }
        session_start();
        $_SESSION['ceshi']=$username;
        //开启session
        $sql_insert = "INSERT INTO deng(email) VALUES('$username')";
        mysqli_query($conn,$sql_insert);
        //日志写入文件，如实现此功能，需要创建文件目录logs
        //跳转到loginsucc.php页面
        header("Location:loginsucc.php");
        //关闭数据库
        mysqli_close($conn);
    }else {
        //用户名或密码错误，赋值err为1
        header("Location:login.php?err=1");
    }
}else {
    //用户名或密码为空，赋值err为2
    header("Location:login.php?err=2");
}

?>