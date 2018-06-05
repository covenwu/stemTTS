
drop database database1;
create database database1;
use database1;
#账号管理4
create table account(
userid int not null primary key auto_increment,							#用户身份标识，具有唯一性	
password varchar(20) not null, 
username varchar(10) not null,											#展示给他人的昵称
classid varchar(30) ,													#classid，groupid暂时设为可为空，		
groupid int ,															#因为教师不具有这两个属性
role enum('admin','tutor','student') not null,							
emailaddress varchar(50) unique,										#邮箱用于登录，不允许重复
numberingroup int
)charset utf8;

#日志
create table log(
timeStamp datetime not null,			
classid varchar(30) not null,
groupid int,
groupNO int,
userid int,
username varchar(10),		#username为用户名
actiontype enum('ReportSubmit','ReportFeedback','ChatMsg','TaskEmail','ReadTask','EditReport','ReadResource') not null,
taskid int,
content text,
url text,
checked tinyint default 0
)charset utf8;

#反馈邮件表
create table feedback(
timeStamp datetime not null,			
userid int,
taskid int,
content text,
evaluation text,
checked tinyint default 0
)charset utf8;

#任务时间表
create table task(
userid int,
timeStamp text,
checked tinyint default 0	
)charset utf8;

#report表
create table report(
classid int,
groupid int,
groupNO int,
userid int,
taskid int,
content text,
url text
)charset utf8;

create table chat(
timeStamp datetime not null,			
classid varchar(30) not null,
groupid int,
username varchar(10),		#username为用户名
content text
)charset utf8;

#作业状态
create table homework_mood(
userid int not null ,
taskid int not null,
evaluation enum("未提交",'批改中','待修改','通过') not null		#作业状态	1未提交 2批改中 3待修改 4通过 
)charset utf8;

#在线用户表
create table onlineuser(
userid int not null,
username varchar(10) not null,	
groupid int not null,
classid int not null,
time datetime
)charset utf8;

#小组信息表
create table group_attr(
classid int not null,
groupid int not null,
taskidnow int not null,
oknumber int default 0  			#作业通过人数
)charset utf8;




#一班三个小组学生
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student0',1,1,'student','0@qq.com',1);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student1',1,1,'student','1@qq.com',2);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student2',1,1,'student','2@qq.com',3);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student3',1,1,'student','3@qq.com',4);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student4',1,2,'student','4@qq.com',1);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student5',1,2,'student','5@qq.com',2);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student6',1,2,'student','6@qq.com',3);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student7',1,2,'student','7@qq.com',4);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student8',1,3,'student','8@qq.com',1);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student9',1,3,'student','9@qq.com',2);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student10',1,3,'student','10@qq.com',3);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student11',1,3,'student','11@qq.com',4);

#二班第三组学生
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student12',2,3,'student','20@qq.com',1);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student13',2,3,'student','21@qq.com',2);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student14',2,3,'student','22@qq.com',3);
insert into account(password,username,classid,groupid,role,emailaddress,numberingroup) values(123,'student15',2,3,'student','23@qq.com',4);

#一班tutor
insert into account(password,username,role,emailaddress,classid) values(123,'tutor1','tutor','12@qq.com',1);

#小组当前任务
insert into group_attr(classid,groupid,taskidnow) values(1,1,1);
insert into group_attr(classid,groupid,taskidnow) values(1,2,1);
insert into group_attr(classid,groupid,taskidnow) values(1,3,1);
insert into group_attr(classid,groupid,taskidnow) values(2,3,1);



#1班1组的第一封任务邮件

#insert into log values('1000-01-01 00:00:00',1,1,1,1,'student0','TaskEmail',1,'系统任务1',0);
INSERT INTO log(timeStamp,classid,groupid,actiontype,content,taskid) VALUES ('1000-01-02 00:00:00',1,1,'TaskEmail','系统任务1',1);
INSERT INTO task VALUES (1,'1000-01-02 00:00:00',0);
INSERT INTO task VALUES (2,'1000-01-02 00:00:00',0);
INSERT INTO task VALUES (3,'1000-01-02 00:00:00',0);
INSERT INTO task VALUES (4,'1000-01-02 00:00:00',0);


#url 测试
#INSERT INTO log(timeStamp,classid,groupid,actiontype,content,userid,url) VALUES ('1000-01-01 00:00:00',1,1,'ReadTask','系统任务22',1,'../upload/test.pdf');


