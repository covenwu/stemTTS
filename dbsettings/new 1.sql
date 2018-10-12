select * from group_attr;
select * from classinfo;
INSERT INTO group_attr(classid,groupid) VALUES (1,1);
INSERT INTO account(username,password,emailaddress,role,tutorid,classid) VALUES('$username','$password','$emailaddress','tutor',1,1);
DELETE * FROM task WHERE userid=1;

INSERT INTO report(classid,groupid,groupNO,userid,taskid,content,url) VALUES (1,1,1
          ,1,1,'$text','$url');
		  

重置到1班1组已分好组，预建两个班级，有几名未分组学生的情况，
http://47.96.146.26/bushu/test/reset.php
重置到只有几个未分组学生信息的情况 
http://47.96.146.26/bushu/test/reset_nodata.php
主页
http://47.96.146.26/bushu/homepage/menu.html