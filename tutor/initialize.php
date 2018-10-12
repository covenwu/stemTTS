<?php

//-----------------常量设置----------------------------------------------
//教师对应小组数
$group_num = 4;
$taskemailnum;

//-----------------获取接口变量----------------------------------------------

$sid = $_GET['sid'];
session_id($sid);
session_start();
$classid = $_SESSION['classid'];
$tutorid = $_SESSION['tutorid'];


//-----------------连接mysql服务器----------------------------------------------
require '../all/mysqllink.php';

//联合查询作业状态数据
$query = "SELECT classid  FROM account WHERE tutorid='$tutorid'";
$ret_classid = mysqli_query($link, $query);
$query = "SELECT username  FROM account WHERE tutorid='$tutorid' limit 1";
$ret_username = mysqli_query($link, $query);
$query = "SELECT classid,classname FROM classinfo ";
$ret_classinfo = mysqli_query($link, $query);
mysqli_close($link);

$classid_arr = [];
while ($rst = mysqli_fetch_assoc($ret_classid)) {
    if ($rst['classid'] != 0) {
        $classid_arr[] = $rst['classid'];
    }
}
$username_arr = mysqli_fetch_assoc($ret_username);
$username = $username_arr['username'];
$xml = simplexml_load_file('pro.xml');
$pro = [];
$taskemailnum = count($xml->children());
for ($i = 0; $i < $taskemailnum; $i++) {
    $task = $xml->task[$i];
    $pro[$i] = [];
    $pro[$i]['rubrics'] = [];
    $pro[$i]['feedback'] = [];
    $assessment = $task->assessment;
    $num = count($assessment->children());
    for ($k = 0; $k < $num; $k++) {
        $pro[$i]['rubrics'][] = (string)$assessment->section[$k]->rubrics;
        $pro[$i]['feedback'][] = (string)$assessment->section[$k]->feedback;
    }
    //反馈邮件部分
    $feedback = $task->feedbackEmail;
    $pro[$i]['feedbackintro'] = (string)$feedback->feedbackIntro;
    $pro[$i]['allAcceptFeedback'] = (string)$feedback->allAcceptFeedback;
    $pro[$i]['allReviseFeedback'] = (string)$feedback->allReviseFeedback;
    $pro[$i]['reviseDeadline'] = (string)$feedback->reviseDeadline;
    //chats
    $chats = $task->chats;
    $pro[$i]['chatName'] = [];
    $pro[$i]['chatMsg'] = [];
    $num = count($chats->children());
    for ($k = 0; $k < $num; $k++) {
        $pro[$i]['chatName'][] = (string)$chats->chat[$k]->chatName;
        $pro[$i]['chatMsg'][] = (string)$chats->chat[$k]->chatMsg;
    }
}
$classinfo_arr = [];
while ($rst = mysqli_fetch_assoc($ret_classinfo)) {
    $classinfo_arr[] = $rst;
}
$info = [];
$info['pro'] = $pro;

$info['classid'] = $classid_arr;
$info['username'] = $username;
$info['classinfo']=$classinfo_arr;
echo(json_encode($info));
