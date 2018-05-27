<?php

$taskemailnum=10;



$xml=simplexml_load_file('pro.xml');
$pro=[];
//task对应taskid，从1开始索引,url从0索引
for($i=0;$i<$taskemailnum;$i++){
    $task=$xml->task[$i];
    $taskname=(string)$task->taskName;
    $pro[$i+1]=[];
    $pro[$i+1]['taskname']=$taskname;
    $pro[$i+1]['resource']=[];
    $resouces=$task->resources;
    $num=count($resouces->children());
    for($k=0;$k<$num;$k++){
        $pro[$i+1]['resource'][$k]=[];
        $pro[$i+1]['resource'][$k]['intro']=(string)$resouces->resource[$k]->introRes;
        $pro[$i+1]['resource'][$k]['url']=(string)$resouces->resource[$k]->resURL;
    }
}
echo(json_encode($pro));