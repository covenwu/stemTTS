<?php
//重置数据库
//-----------------mysql参数----------------------------------------------
require '../all/mysqlattr.php';



function insert($file,$database,$name,$root,$pwd)//
{
    //将表导入数据库
    header("Content-type: text/html; charset=utf-8");
    $_sql = file_get_contents($file);//写自己的.sql文件
    $_arr = explode(';', $_sql);
    $_mysqli = new mysqli($name,$root,$pwd,$database);//第一个参数为域名，第二个为用户名，第三个为密码，第四个为数据库名字
    if (mysqli_connect_errno())
    {
        exit('连接数据库出错');
    }
    else{
        //执行sql语句
        $_mysqli->query('set names utf8;'); //设置编码方式
        foreach ($_arr as $_value) {
            $_mysqli->query($_value.';');
        }
        echo "插入成功";
    }
    $_mysqli->close();
    $_mysqli = null;
}


insert("test.sql",$dbname,$servername,$usern,$passw);
//文件名，数据库名字,域名，用户名，密码