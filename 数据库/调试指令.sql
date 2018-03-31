insert into account(id,name,classid,groupid,role,email) values(1,"老张",13,5,'student',"2041834343@qq.com");

#select语句
select * from account;
select * from email_history;
select * from homework_history;

insert into homework_history(time,classid,id,name,taskid,homeworkcontent) values('1000-01-01 00:00:00'
  ,(select(classid) from account where account.id=1),1,(select(name) from account where account.id='1'),
 '123','这是作业内容');
 
delete from homework_history where name="Paul" AND taskid=123;

#account表
insert into account(userid,username,classid,groupid,role,emailaddress,taskidnow) values(1,'张润权',0,0,'student',

#homework_history表
insert into homework_history(time,classid,id,name,taskid,homeworkcontent) values('1000-01-01 00:00:00'
  ,13,1,"张润权",
 '155','这是作业内容');
 
insert into homework_history(time,classid,id,name,taskid,homeworkcontent) values('1000-01-01 00:00:00'
  ,13,4,"Pail",
 '897','Hello teacher ！');
 #添加未提交作业记录
 insert into homework_history(time,classid,id,name,taskid) values('1000-01-01 00:00:00'
  ,13,1,"张润权",
 '155');
 
#email_history表
insert into email_history(time,classid,userid,username,emailcontent) values('1000-01-01 00:00:00'
  ,13,1,"张润权",
 "这是Email内容");

#新聊天室表
select *from message;
insert into message(msg,sender,groupid,add_time) values('测试喽0，132，zbc','老张sd12',0,'1000-01-01 00:00:00');
insert into message(msg,sender,groupid,add_time) values('测试喽1，132，zbc','老张sd12',1,'1000-01-01 00:00:00');
insert into message(msg,sender,groupid,add_time) values('测试喽2，132，zbc','老张sd12',2,'1000-01-01 00:00:00');
insert into message(msg,sender,groupid,add_time) values('测试喽3，132，zbc','老张sd12',3,'1000-01-01 00:00:00');
drop table message;

#onlineuser表
select *from onlineuser;

#teacher_group表
insert into teacher_group values(2,0,1,2,3);
select *from teacher_group;
