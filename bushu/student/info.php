<?php
$taskemailnum;


$sid=$_GET['sid'];
session_id($sid);
session_start();
$groupid=$_SESSION['groupid'];
$classid=$_SESSION['classid'];
$userid = $_SESSION['userid'];

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

//取得当前taskid，为防止taskid变动，不保存在session中，每次现查
$query="SELECT taskidnow FROM group_attr WHERE classid='$classid' AND groupid='$groupid' limit 1";
$ret=mysqli_query($link,$query);
$taskid_arr=mysqli_fetch_assoc($ret);
$taskidnow=$taskid_arr['taskidnow'];

//查询feedback
$query="SELECT * FROM feedback WHERE userid='$userid'";
$ret_feedback=mysqli_query($link,$query);

//查询report
$query="SELECT content,url,urlname FROM report WHERE userid='$userid' limit {$taskidnow}";
$ret_report=mysqli_query($link,$query);

//查询task的时间
$query="SELECT timeStamp,checked FROM task WHERE userid='$userid' limit 1";
$ret_task=mysqli_query($link,$query);

//查询小组学生成员
$query="SELECT username,userid,role FROM account WHERE (classid='$classid' AND groupid='$groupid') OR (classid='$classid' AND role='tutor')";
$ret_group=mysqli_query($link,$query);



mysqli_close($link);

//查询xml信息
$xml=simplexml_load_file('pro.xml');
$pro=[];
$taskemailnum=count($xml->children());

for($i=0;$i<$taskemailnum;$i++){
    $task=$xml->task[$i];
    $taskname=(string)$task->taskName;
    $pro[$i]=[];
    $pro[$i]['intro']=[];
    $pro[$i]['url']=[];
    $pro[$i]['taskname']=$taskname;
    $resouces=$task->resources;
    $num=count($resouces->children());
    for($k=0;$k<$num;$k++){
        $pro[$i]['intro'][$k]=(string)$resouces->resource[$k]->introRes;
        $pro[$i]['url'][$k]=(string)$resouces->resource[$k]->resURL;
    }
    $taskemail=$task->taskEmail;
    $pro[$i]['backgroundinfo']=(string)$taskemail->backgroundInfo;
    $pro[$i]['taskreq']=(string)$taskemail->taskReq;
    $pro[$i]['deadline']=(string)$taskemail->deadline;
}



//把信息存储到一个数组
$info=[];

$info['pro']=[];
$info['pro']=$pro;

$info['feedback']=[];
while ($rst = mysqli_fetch_assoc($ret_feedback)) {
    $info['feedback'][] = $rst;
}
$info['report']=[];
while ($rst = mysqli_fetch_assoc($ret_report)) {
    $info['report'][] = $rst;
}
$num=count($info['report']);
for($i=0;$i<$num;$i++){
    //处理url
    $url_str=$info['report'][$i]['url'];
    $url_arr=explode(',',$url_str);
    $url_arr = array_filter($url_arr);
    $info['report'][$i]['url']=$url_arr;
    //处理urlname
    $urlname_str=$info['report'][$i]['urlname'];
    $urlname_arr=explode('@!',$urlname_str);
    $urlname_arr = array_filter($urlname_arr);
    $info['report'][$i]['urlname']=$urlname_arr;
}


$info['task']=[];
while ($rst = mysqli_fetch_assoc($ret_task)) {
    $info['task'][] = $rst;
}
$info['task']['checked']=$info['task'][0]['checked'];
$time_arr=explode(",",$info['task'][0]['timeStamp']);
$time_arr = array_filter($time_arr);

foreach ($time_arr as $key=>$value){
    $info['task'][$key]=[];
    $info['task'][$key]['timeStamp']=$value;
    $info['task'][$key]['taskid']=$key+1;
}


$info['group']=[];
$info['group']['userid']=[];
$info['group']['username']=[];

$group=[];
while ($rst = mysqli_fetch_assoc($ret_group)) {
    $group[] = $rst;
}
foreach ($group as $key=>$value){
    if($group[$key]['role']=='student'){
        $info['group']['userid'][]=$group[$key]['userid'];
        $info['group']['username'][]=$group[$key]['username'];
    }
    if($group[$key]['role']=='tutor'){
        $tutorindex=$key;
    }
}
$info['group']['userid'][]=$group[$tutorindex]['userid'];
$info['group']['username'][]=$group[$tutorindex]['username'];


//存储用户信息
$info['user']=[];
$info['user']=$_SESSION;

echo (json_encode($info));




