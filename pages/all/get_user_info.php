<?php
header("Content-Type:application/json");
$sid=$_GET['sid'];
session_id($sid);
session_start();
echo(json_encode($_SESSION));