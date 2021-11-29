<?php

$passHash = password_hash("hoda@4r9j1u4e7x8c@diah", PASSWORD_DEFAULT);
//echo $passHash;

$passVerify = password_verify("hoda@4r9j1u4e7x8c@diah", $passHash);
if(!$passVerify)
{
	echo("<br/>Can't verify password!");
}
else
{
	echo("<br/>Password Verified! Welcome!");
}
?>