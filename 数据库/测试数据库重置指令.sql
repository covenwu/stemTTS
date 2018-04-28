
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

#日志管理
create table action_log(
userid int not null ,
username varchar(10) not null,
classid varchar(30) not null,
groupid int not null,
taskid int not null,
time datetime not null,
actiontype enum('ReadTaskeMail','ReadMaterial','ReadFeedbackEmail','SendTaskEmail','SendMsg'),
content text,
sendto varchar(50) not null
)charset utf8;

#聊天记录
create table chat_history(
time datetime not null,			
classid varchar(30) not null,
userid int not null ,
username varchar(10) not null,		#username为用户名
groupid int not null,
chatcontent text
)charset utf8;



#作业记录3
create table homework_history(
time datetime not null,			
classid varchar(30) not null,
userid int not null ,
username varchar(10) not null,		#username为用户名
taskid int not null,
homeworkcontent text,
evaluation enum("未提交",'批改中','待修改','通过') not null,		#作业状态	1未提交 2批改中 3待修改 4通过 
groupid int not null,
numberingroup int not null
)charset utf8;

#导师邮件记录
create table email_history(
time datetime not null,			
classid varchar(30) not null,
userid int not null ,
username varchar(10) not null,	
emailcontent text
)charset utf8;

#系统邮件记录
create table system_history(
taskid int not null primary key,
emailcontent text
)charset utf8;

#新聊天室表
create table message(
messageid int not null auto_increment primary key,
msg varchar(250) not null,
sender varchar(30),
groupid int not null,
add_time datetime not null
)charset utf8;

#在线用户表
create table onlineuser(
userid int not null,
username varchar(10) not null,	
groupid int not null,
time datetime
)charset utf8;

#教师管理的小组表
create table teacher_group(
userid int not null primary key,
group0 int,							#从0开始
group1 int,
group2 int,
group3 int
)charset utf8;

#小组对应任务id表
create table group_attr(
groupid int not null,
taskidnow int not null
)charset utf8;



#设置初始数据
 
#学生
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

#tutor
insert into account(password,username,role,emailaddress) values(123,'tutor1','tutor','12@qq.com');

#小组当前任务
insert into group_attr values(1,1);
insert into group_attr values(2,1);
insert into group_attr values(3,1);

#教师管理的小组
insert into teacher_group values(13,1,2,3,4);


