<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/1/24
 * Time: 14:43
 */
//require 'share_file.php';

function creat($name,$taskid,$id)//name为task或其下一级目录
{
    if ($name == "resources") {
        $dom = new DOMDocument('1.0');
        $dom->load('./pro.xml');
        $task_list = $dom->getElementsByTagName('task');
        foreach ($task_list as $list) {
            if ($list->getAttribute('id') == $taskid) {//找到id为给定值的task
                $resources = $list->getElementsByTagName('resources');//找出resources列表
                foreach ($resources as $resources){//以下对于resources单独操作
                    $resource = $dom->createElement('resource');//新建节点
                    $resources->appendChild($resource);//将新建节点添加到根节点中

                    $resource_attr_obj = $dom->createAttribute('id');
                    $resource_attr_obj->value = $id;//将属性id设为$id
                    $resource->appendChild($resource_attr_obj);

                    $introRes = $dom->createElement('introRes');
                    $resource->appendChild($introRes);
                    $resURL = $dom->createElement('resURL');
                    $resource->appendChild($resURL);
                    echo "creat successfully!";
                }
            }
        }

    }

    if ($name == "assessment") {
        $dom = new DOMDocument('1.0');
        $dom->load('./pro.xml');
        $task_list = $dom->getElementsByTagName('task');
        foreach ($task_list as $list) {
            if ($list->getAttribute('id') == $taskid){//找到id为给定值的task
                $assessment = $list->getElementsByTagName('assessment');//找出assessment列表
                foreach ($assessment as $assessment) {//以下对于assessment单独操作
                    $section = $dom->createElement('section');//新建节点
                    $assessment->appendChild($section);//将新建节点添加到根节点中

                    $section_attr_obj = $dom->createAttribute('id');
                    $section_attr_obj->value = $id;//将属性id设为$id
                    $section->appendChild($section_attr_obj);

                    $rubrics = $dom->createElement('rubrics');
                    $section->appendChild($rubrics);
                    $score = $dom->createElement('score');
                    $section->appendChild($score);
                    $feedback=$dom->createElement('feedback');
                    $section->appendChild($feedback);
                    echo "creat successfully!";
                }
            }
        }
    }

    if ($name == "chats") {
        //chats
        $dom = new DOMDocument('1.0');
        $dom->load('./pro.xml');
        $task_list = $dom->getElementsByTagName('task');
        foreach ($task_list as $list) {
            if ($list->getAttribute('id') == $taskid){//找到id为给定值的task
                $chats = $list->getElementsByTagName('chats');//找出chats列表
                foreach ($chats as $chats) {//以下对于chats单独操作
                    $chat = $dom->createElement('chat');//新建节点
                    $chats->appendChild($chat);//将新建节点添加到根节点中

                    $chat_attr_obj = $dom->createAttribute('id');
                    $chat_attr_obj->value = $id;//将属性id设为$id
                    $chat->appendChild($chat_attr_obj);

                    $chatName = $dom->createElement('chatName');
                    $chat->appendChild($chatName);
                    $chatMsg = $dom->createElement('chatMsg');
                    $chat->appendChild($chatMsg);
                    echo "creat successfully!";
                }
            }
        }
    }
    $dom->save('./pro.xml');
}

function creatxml(){
    /*
 * 创建xml文件
 */
    $dom = new DOMDocument('1.0','utf-8');
    $dom->formatOutput = true;//格式化

    $tasks = $dom->createElement('tasks');//创建根节点EventList
    $dom->appendChild($tasks);//添加根节点

    $dom->save('./pro.xml');//保存信息到当前目录下的pro.xml文件中
}

function creatTask($taskid){
 //task
        $dom = new DOMDocument('1.0');
        $dom->load('./pro.xml');
        $task_list = $dom->getElementsByTagName('tasks');//获取根节点
        $task = $dom->createElement('task');//新建节点
        $task_list->item(0)->appendChild($task);//将新建节点添加到根节点中

        $task_attr_obj = $dom->createAttribute('id');
        $task_attr_obj->value = $taskid;//将属性id设为$taskid
        $task->appendChild($task_attr_obj);

        $taskx_list = $dom->getElementsByTagName('task');
        foreach ($taskx_list as $list) {
            if ($list->getAttribute('id') == $taskid) {
                $taskName = $dom->createElement('taskName');
                $taskEmail = $dom->createElement('taskEmail');
                $resources = $dom->createElement('resources');
                $assessment = $dom->createElement('assessment');
                $chats = $dom->createElement('chats');
                $feedbackEmail = $dom->createElement('feedbackEmail');
                $list->appendChild($taskName);
                $list->appendChild($taskEmail);
                $list->appendChild($resources);
                $list->appendChild($assessment);
                $list->appendChild($chats);
                $list->appendChild($feedbackEmail);
                $backgroundInfo=$dom->createElement('backgroundInfo');//往后为taskEmail部分
                $taskReq=$dom->createElement('taskReq');
                $deadline=$dom->createElement('deadline');
                $taskEmail->appendChild($backgroundInfo);
                $taskEmail->appendChild($taskReq);
                $taskEmail->appendChild($deadline);
                $feedbackIntro=$dom->createElement('feedbackIntro');//往后为feedback部分
                $allAcceptFeedback=$dom->createElement('allAcceptFeedback');
                $allReviseFeedback=$dom->createElement('allReviseFeedback');
                $excellentSection=$dom->createElement('excellentSection');
                $goodSection=$dom->createElement('goodSection');
                $reviseSection=$dom->createElement('reviseSection');
                $reviseDeadline=$dom->createElement('reviseDeadline');
                $absentEmail=$dom->createElement('absentEmail');
                $missDeadlineEmail=$dom->createElement('missDeadlineEmail');
                $feedbackEmail->appendChild($feedbackIntro);
                $feedbackEmail->appendChild($allAcceptFeedback);
                $feedbackEmail->appendChild($allReviseFeedback);
                $feedbackEmail->appendChild($excellentSection);
                $feedbackEmail->appendChild($goodSection);
                $feedbackEmail->appendChild($reviseSection);
                $feedbackEmail->appendChild($reviseDeadline);
                $feedbackEmail->appendChild($absentEmail);
                $feedbackEmail->appendChild($missDeadlineEmail);
//                echo "creat task successfully!";
            }
        }


    $dom->save('./pro.xml');
    creat('resources',$taskid,1);
    creat('assessment',$taskid,1);
    creat('chats',$taskid,1);
}


function change($what,$taskid,$name,$name2,$id){//what为改成的内容，id为低阶目录下需要分辨的id，name为id前面的名字（没有id时为task下一级目录）
    //name2为name的下一级目录
    $dom = new DOMDocument('1.0');
    $dom->load('./pro.xml');
    $list = $dom->getElementsByTagName('task');
    foreach($list as $item){
        if( $item->getAttribute('id')== $taskid){
            if($name=='taskName'){
        //        $task[$taskid]->taskname=$what;

                $taskName=$item->getElementsByTagName('taskName');
                foreach ($taskName as $taskName)
                    if($taskName->nodeValue=$what)echo'successfully';
            }
            else if($name=='taskEmail'||$name=='feedbackEmail'){
                $taskEmail=$item->getElementsByTagName($name2);
                foreach ($taskEmail as $taskEmail)//
                    if($taskEmail->nodeValue=$what)echo'successfully';
            }
            else if($name=='resource'||$name=='section'||$name=='chat'){
                $resource=$item->getElementsByTagName($name);
                foreach ($resource as $item){
                    if($item->getAttribute('id') == $id){
                        $list=$item->getElementsByTagName($name2);
                        foreach ($list as $list)
                            if($list->nodeValue=$what)echo'successfully';
                    }
                }
            }
        }
    }

    $dom->save('./pro.xml');
}

function delete($name,$taskid,$id){//其中name为id前的目录名字，如‘resource’等
                                                   //$taskid为task的id，id为二级目录的id，若没有可随意填写
    $dom = new DOMDocument('1.0');
    $dom->load('./pro.xml');
    $list = $dom->getElementsByTagName('task');
    foreach($list as $item){
        if ($item->getAttribute('id') == $taskid) {//以id为$taskid的节点为操作对象
            if($name=="task") {
                $item->parentNode->removeChild($item);//删除节点
                echo "delete successful";//确认
            }
            else if($name=='resource'||$name=='section'||$name=='chat'){
                $resource=$item->getElementsByTagName($name);
                foreach ($resource as $resource)
                if($resource->getAttribute('id') == $id){
                    $resource->parentNode->removeChild($resource);//删除节点
                    echo "delete successful";//确认
                    }
                }
                else
                    echo 'false';
            }
        }
    $dom->save('./pro.xml');
}

function output($name,$name2,$taskid,$id){//用于输出特定节点的值，其中name为task下一级目录的名字，name2为具体节点名字
    $xml = simplexml_load_file('pro.xml');
    $task = $xml->task;
    foreach ( $task as $content )
    {
        if($content['id']==$taskid){
            if($name=='taskName'){
                return $content->$name;}
            if($name=='taskEmail'){
                return $content->taskEmail->$name2;
            }
            if($name=='resources'){
                $resource=$content->resources->resource;
                foreach ($resource as $resource)
                if($resource['id']==$id){
                    return $resource->$name2;
                }
            }
            if($name=='assessment'){
                $section=$content->assessment->section;
                foreach ($section as $section)
                if($section['id']==$id){
                    return $section->$name2;
                }
            }
            if($name=='chats'){
                $chat=$content->chats->chat;
                foreach ($chat as $chat)
                if($chat['id']==$id){
                    return $chat->$name2;
                }
            }
            if($name=='feedbackEmail')
                return $content->feedbackEmail->$name2;
        }
    }
}

function saveTaskName($taskName,$taskid){
    change($taskName,$taskid,'taskName',0,0);
}

function saveEmail($taskid,$backgroundInfo,$taskReq,$deadline){
    change($backgroundInfo,$taskid,'taskEmail','backgroundInfo',0);
    change($taskReq,$taskid,'taskEmail','taskReq',0);
    change($deadline,$taskid,'taskEmail','deadline',0);
}

function saveResource($taskid,$resourceid,$introRes,$resURL){
    change($introRes,$taskid,'resource','introRes',$resourceid);
    change($resURL,$taskid,'resource','resURL',$resourceid);
}

function saveAssessment($taskid,$sectionid,$rubrics,$score,$feedback){
    change($rubrics,$taskid,'section','rubrics',$sectionid);
    change($score,$taskid,'section','score',$sectionid);
    change($feedback,$taskid,'section','feedback',$sectionid);
}

function saveChat($taskid,$chatid,$chatName,$chatMsg){
    change($chatName,$taskid,'chat','chatName',$chatid);
    change($chatMsg,$taskid,'chat','chatMsg',$chatid);
}

function saveFeedbackEmail($taskid,$feedbackIntro,$allAcceptFeedback,$allReviseFeedback,$excellentSection,$goodSection,$reviseSection,$reviseDeadline,$absentEmail,$missDeadlineEmail){
    change($feedbackIntro,$taskid,'feedbackEmail','feedbackIntro',0);
    change($allAcceptFeedback,$taskid,'feedbackEmail','allAcceptFeedback',0);
    change($allReviseFeedback,$taskid,'feedbackEmail','allReviseFeedback',0);
    change($excellentSection,$taskid,'feedbackEmail','excellentSection',0);
    change($goodSection,$taskid,'feedbackEmail','goodSection',0);
    change($reviseSection,$taskid,'feedbackEmail','reviseSection',0);
    change($reviseDeadline,$taskid,'feedbackEmail','reviseDeadline',0);
    change($absentEmail,$taskid,'feedbackEmail','absentEmail',0);
    change($missDeadlineEmail,$taskid,'feedbackEmail','missDeadlineEmail',0);
}


function everyStudent($taskid,&$b){
    $c=array();
    $b[$taskid][0]=output('taskName',0,$taskid,0);
    $b[$taskid][1]=array();
    $num=otherNumber('resources',$taskid,$c);
    for($i=0;$i<$num;$i++){
        $b[$taskid][1][$i][0]=output('resources','introRes',$taskid,$c[$i]);
        $b[$taskid][1][$i][1]=output('resources','resURL',$taskid,$c[$i]);
    }
    $b[$taskid][2]=output('taskEmail','backgroundInfo',$taskid,0);
    $b[$taskid][3]=output('taskEmail','taskReq',$taskid,0);
    $b[$taskid][4]=output('taskEmail','deadline',$taskid,0);
}

function everyTeacher($taskid,&$b){
    $b[$taskid][0]=array();
    $b[$taskid][1]=array();
    $num1=otherNumber('assessment',$taskid,$c);
    for($i=0;$i<$num1;$i++){
        $b[$taskid][0][$i][0]=output('assessment','rubrics',$taskid,$c[$i]);
        $b[$taskid][0][$i][1]=output('assessment','score',$taskid,$c[$i]);
        $b[$taskid][0][$i][1]=output('assessment','feedback',$taskid,$c[$i]);
    }
    $num2=otherNumber('chats',$taskid,$c);
    for($i=0;$i<$num2;$i++){
        $b[$taskid][1][$i][0]=output('chats','chatName',$taskid,$c[$i]);
        $b[$taskid][1][$i][1]=output('chats','chatMsg',$taskid,$c[$i]);
    }
    $b[$taskid][2]=output('feedbackEmail','feedbackIntro',$taskid,0);
    $b[$taskid][3]=output('feedbackEmail','allAcceptFeedback',$taskid,0);
    $b[$taskid][4]=output('feedbackEmail','allReviseFeedback',$taskid,0);
    $b[$taskid][5]=output('taskEmail','deadline',$taskid,0);
}

//$taskNumber=array();//存放各个task的id
function taskNumber(&$a){
    $numT=0;
    $a=array();
    $xml = simplexml_load_file('pro.xml');
    $task = $xml->task;
    foreach ( $task as $content ){
        $a[$numT]=(int)$content['id'];
        $numT+=1;
    }
    return $numT;
}
//$taskNum=taskNumber($taskNumber);//存放task的数目
//print_r($taskNumber);


function otherNumber($name,$taskid,&$a){//用于数数
    $num=0;
    $a=array();
    $xml = simplexml_load_file('pro.xml');
    $task = $xml->task;
    foreach ( $task as $content ){
        if($content['id']==$taskid){
            if($name=='resources'){
                $resource=$content->resources->resource;
                foreach ($resource as $item){
                    $a[$num]=(int)$item['id'];
                    $num++;
                }
            }
            if($name=='assessment'){
                $section=$content->assessment->section;
                foreach ($section as $item){
                    $a[$num]=(int)$item['id'];
                    $num++;
                }
            }
            if($name=='chats'){
                $chat=$content->chats->chat;
                foreach ($chat as $item){
                    $a[$num]=(int)$item['id'];
                    $num++;
                }
            }
        }
    }
    return $num;
}

function deleteAll($taskid,$name){
    $otherNum=otherNumber($name,$taskid,$otherNumber);
    if($name=='resources')$name1='resource';
    if($name=='assessment')$name1='section';
    if($name=='chats')$name1='chat';
    for($i=1;$i<=$otherNum;$i++){
        delete($name1,$taskid,$i);
    }
}
//$otherNum=otherNumber('resources',2,$otherNumber);//存放task的数目
//print_r($otherNumber);

//$a=array('asd','ds','as');

//creatxml();
//creat("task",1,1);
//creatTask(3);creatTask(4);creatTask(5);creatTask(6);creatTask(7);creatTask(8);creatTask(9);
//creatTask(12);
//change('jkhkk',1,'chat','chatName',1);
//delete("task",11,1);
//output('chats','chatName',1,1);

//saveFeedbackEmail(1,'heheh',0,0,0,0,0,0,0,0);
//change($_POST["feedbackIntro"],1,'feedbackEmail','feedbackIntro',0);
/*
for($i=1;$i<11;$i++){
    saveTaskName('task'.$i,$i);
    saveEmail($i,'b'.$i,'R'.$i,'d'.$i);
    saveResource($i,1,'introRes'.$i,'resURL'.$i);

    saveAssessment($i,1,'rubrics'.$i,'score'.$i,'feedback'.$i);

    saveChat($i,1,'chatName'.$i,'chatMsg'.$i);

    saveFeedbackEmail($i,'feedbackIntro'.$i,'allAcceptFeedback'.$i,'allReviseFeedback'.$i,'excellentSection'.$i,'goodSection'.$i,'reviseSection'.$i,'reviseDeadline'.$i,'absentEmail'.$i,'missDeadlineEmail'.$i);
}
*/

$q=$_GET["q"];
$p=$_GET["p"];

if($q=="feedbackEmail")
{
    $a=array(output('feedbackEmail', 'feedbackIntro', $p, 1),
        output('feedbackEmail', 'allAcceptFeedback', $p, 1),
        output('feedbackEmail', 'allReviseFeedback', $p, 1),
        output('feedbackEmail', 'excellentSection', $p, 1),
        output('feedbackEmail', 'reviseSection', $p, 1),
        output('feedbackEmail', 'reviseDeadline', $p, 1),
        output('feedbackEmail', 'absentEmail', $p, 1),
        output('feedbackEmail', 'missDeadlineEmail', $p, 1));

    echo(json_encode($a));
}

if($q=="taskEmail")
{
 //   $p=$_GET["p"];
    $a=array(output('taskEmail', 'backgroundInfo', $p, 1),
        output('taskEmail', 'taskReq', $p, 1),
        output('taskEmail', 'deadline', $p, 1),
        );

    echo(json_encode($a));
}

if($q=='button'){
    //按钮页面
    $numT=0;
    $a=array();
    $xml = simplexml_load_file('pro.xml');
    $task = $xml->task;
    foreach ( $task as $content ){
        $a[$numT]=$content['id'];//$a数组中为各个任务的id
        $numT+=1;
    }

    echo $numT;//输出任务数量
}

  if($q=='task'){
      $otherNum=taskNumber($otherNumber);
      $a=array();//返回数组
      $a[0]=$otherNum;//该数组的第一项是资源数目
      for($i=1;$i<=$otherNum;$i++){
          $a[$i]=$otherNumber[$i-1];//后面每一项对应资源id
      }

      echo(json_encode($a));
  }

if($q=='resources'){
//    $p=$_GET["p"];
    $otherNum=otherNumber('resources',$p,$otherNumber);
    $a=array();//返回数组
    $a[0]=$otherNum;//该数组的第一项是资源数目
    for($i=1;$i<=$otherNum;$i++){
        $a[$i][0]=$otherNumber[$i-1];//该资源的id
        $a[$i][1]=output('resources','introRes',$p,$otherNumber[$i-1]);//后面每一项对应资源内容
        $a[$i][2]=output('resources','resURL',$p,$otherNumber[$i-1]);
    }
    echo(json_encode($a));
}

  if($q=='assessment'){
      $otherNum=otherNumber('assessment',$p,$otherNumber);
      $a=array();//返回数组
      $a[0]=$otherNum;//该数组的第一项是资源数目
      for($i=1;$i<=$otherNum;$i++){
          $a[$i][0]=$otherNumber[$i-1];//该资源的id
          $a[$i][1]=output('assessment','rubrics',$p,$otherNumber[$i-1]);//后面每一项对应资源内容
          $a[$i][2]=output('assessment','score',$p,$otherNumber[$i-1]);
          $a[$i][3]=output('assessment','feedback',$p,$otherNumber[$i-1]);
      }
      echo(json_encode($a));
  }

if($q=='chats'){
    $otherNum=otherNumber('chats',$p,$otherNumber);
    $a=array();//返回数组
    $a[0]=$otherNum;//该数组的第一项是资源数目
    for($i=1;$i<=$otherNum;$i++){
        $a[$i][0]=$otherNumber[$i-1];
        $a[$i][1]=output('chats','chatName',$p,$otherNumber[$i-1]);//后面每一项对应资源内容
        $a[$i][2]=output('chats','chatMsg',$p,$otherNumber[$i-1]);
    }
    echo(json_encode($a));
}

if($q=='saveFeedbackEmail'){
    saveFeedbackEmail($p,$_GET['feedbackIntro'],$_GET["allAcceptFeedback"],$_GET["allReviseFeedback"],$_GET["excellentSection"],0,$_GET["reviseSection"],$_GET["reviseDeadline"],$_GET["absentEmail"],$_GET["missDeadlineEmail"]);
    echo 'ok';
}

if($q=='saveTaskEmail'){
    saveEmail($p,$_GET['backgroundInfo'],$_GET['taskReq'],$_GET['deadline']);
}
/*
if($q=='saveResources'){
    echo $_GET['name1'];
    $i=0;

    for(;;$i++){
        if(!$_GET['name'.$i])break;
    }//计算有几个resource

    /*
    for($j=1;$j<$i;$j++){//对每个resource进行保存
        saveResource($p,$j,$_GET['name'.$j],$_GET['file'.$j]);
        saveResource($p,$j,$_GET['name'.$j],$_GET['file'.$j]);
    }
}
*/
if($q=='saveAssessment'){
  //  echo $_GET['name1'];
/*    $i=1;
    for(;;$i++){
        if(!$_GET['rubrics'.$i])break;
    }   //计算有几个assessment
    echo $i;
print_r( $_GET["num"]);
deleteAll($p,'assessment');*/
  // print_r(explode(',', $_GET['num']));//将字符串以!分割为一个一维数组,参数一不可以为""($_GET['num']);
//   echo $arr[0].','.$arr[1].','.$arr[2].','.$arr[3].','.$arr[4].','.$arr[5].','
 //     .$arr[6].','.$arr[7].','.$arr[8].','.$arr[9].','.$arr[10].','.$arr[11].',';
    $_GET['num']=explode(',', $_GET['num']);
    for($j=1;$j<=$_GET['num'][0];$j++){//对每个assessment进行保存
        $i=$_GET['num'][$j];
        saveAssessment($p,$i,$_GET['rubrics'.$i],$_GET['score'.$i],$_GET['feedback'.$i]);
    }

}

if($q=='saveChats'){
     $_GET['num']=explode(',', $_GET['num']);
    for($j=1;$j<=$_GET['num'][0];$j++){//对每个chat进行保存
        $k=$_GET['num'][$j];
        echo $_GET['chatName'.$k].',';
        saveChat($p,$k,$_GET['chatName'.$k],$_GET['chatMsg'.$k]);
    }
}

  if($q=='addTask'){
 //     $p=$_GET["p"];
      creatTask($p);
  }

  if($q=='deleteTask'){
 //   $p=$_GET["p"];
    delete('task',$p,0);
  }

  if($q=='addAssessment'){
    creat('assessment',$_GET['x'],$p);
  }

  if($q=='deleteAssessment'){
    delete('section',$_GET['x'],$p);
  }

if($q=='addChat'){
    creat('chats',$_GET['x'],$p);
}

if($q=='deleteChat'){
    delete('chat',$_GET['x'],$p);
}