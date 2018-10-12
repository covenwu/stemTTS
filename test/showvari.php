<?php
date_default_timezone_set('PRC');
$time=date('YmdHis',time());

//$file='/usr/local/mysql/log'.$time.'.xls';
//$file='../log/log'.$time.'.xls';
$file='/home/www/htdocs/bushu2/log/log'.$time.'.xls';



//$query="SELECT * FROM log INTO outfile '/usr/local/mysql/log.xls' ";
$query="show variables like '%secure%'";
//$query="SELECT * FROM log INTO outfile '".$file."'";
echo $query;
require '../all/mysqllink.php';
$res=mysqli_query($link,$query);
while($ret=mysqli_fetch_assoc($res)){
    print_r($ret);
}


if(!mysqli_query($link,$query)){
    //echo '123';
    echo $link->error;
}
//echo "<a href=\"/usr/local/mysql/log.xls\"><a>";
//echo "<a href=\"".$file."\"><a>";
//print_r($file);
//print_r("<a href=\"".$file."\"><a>");
//header($file);