<?php

include '../Rules.php';

$r = new Rules();
$dd = $r->initRulesMap("./order.drl");
$data = array(
    'user' => array(
        'order' => array(
            'order_id' => 1016,
            'id' => 8888,
            'name' => 'zhangsan',
            'price' => 200,
            'mihome' => '',
        )
    ),
    'address' => "北京市朝阳区",
);




$data = array(
    'user' => array(
        'order' => array(
            'order_id' => 1017,
            'id' => 6666,
            'name' => 'lisi',
            'price' => 18,
            'mihome' => '',
        )
    ),
    'address' => "上海市徐汇区",
);

print_r($data);
$r->import($data);
$r->execute('AssignOrder');
print_r($r->data);
exit;
