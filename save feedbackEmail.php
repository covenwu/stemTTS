<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/3/24
 * Time: 10:37
 */

require 'project1.php';
if($_POST['q']='feedbackEmail')
saveFeedbackEmail($_POST['p'],$_POST['feedbackIntro'],$_POST["allAcceptFeedback"],$_POST["allReviseFeedback"],$_POST["excellentSection"],0,$_POST["reviseSection"],$_POST["reviseDeadline"],$_POST["absentEmail"],$_POST["missDeadlineEmail"]);

if($_POST['q']='taskEmail')
    saveEmail($_POST['p'],$_POST['backgroundInfo'],$_POST["taskReq"],$_POST["deadline"]);

//get the q parameter from URL
/*$q=$_GET["q"];
if($q=='show%0'){
    output("feedbackEmail",'feedbackIntro',1,1);
}
else change($q,1,'feedbackEmail','feedbackIntro',0);
//output('feedbackEmail','feedbackIntro',1,0);
*/
