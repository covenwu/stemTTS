<!DOCTYPE html>
<html>
<head>
    <title>登录成功</title>
    <meta name="content-type"; charset=UTF-8">
</head>
<body>
<div>
    <?php
    header("content-type:text/html;charset=utf-8");
    //开启session
    session_start();
    //声明变量
    $username= isset($_SESSION['ceshi'])?$_SESSION['ceshi']:"";
    //判断session是否为空
    if(!empty($username)){
        ?>
        <h1>登录成功！</h1>
        欢迎您！
        <?php
        echo $username;
        ?>
        <br/>
        <a href="logout.php">退出</a>
        <?php
    }else {
        //未登录，无权访问
        ?>
        <h1>你无权访问！！！</h1>
        <?php
    }
    ?>
</div>
</body>
</html>