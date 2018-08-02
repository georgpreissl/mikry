<?php
mysql_connect('db1091.mydbserver.com','p153994','Z2Bsltcl');
mysql_select_db('usr_p153994_1') or die('<b>Fehler:</b>'.mysql_error());

mysql_query('CREATE TABLE IF NOT EXISTS georg_flickry(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	player varchar(50),
	keyword varchar(50),
	pairs int(11),
	sec varchar(20)
);') or die(mysql_error());

$player = $_POST['player'];
$keyword = $_POST['keyword'];
//$keyword = "sadf";
$pairs = $_POST['pairs'];
$sec = $_POST['sec'];



if (isset($player)) {
mysql_query("INSERT INTO georg_flickry (player,keyword,pairs,sec) VALUES ('".$player."','".$keyword."','".$pairs."','".$sec."');") or die(mysql_error());

}


$r=mysql_query("select * from georg_flickry where pairs='".$pairs."' ORDER BY sec") or die(mysql_error());

$rank = 1;
while($o = mysql_fetch_object($r)){
	echo "<tr class='scoreRow' >\
	<td class='rank_col'>".$rank."</td>\
	<td class='player_col'>".$o->player."</td>\
	<td class='kw_col'>".$o->keyword."</td>\
	<td class='sec_col'>".$o->sec."</td>\
	</tr>";
	$rank++;
}	

//	<td class='pairs_col'>".$o->pairs."</td>\


?>