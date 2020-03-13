<?php
$res=['code'=>0,"msg"=>"验证成功","data"=>["jumpURL"=>"https://www.baidu.com/"]];
$r=file_get_contents("php://input");
// print_r(json_encode(json_decode($r)));
// print_r ($_FILES['file']);
// sleep(10);
print_r (json_encode($_COOKIE));

// print_r(json_encode($res));