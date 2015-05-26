<?php

    require(__DIR__ . "/../includes/config.php");

    // numerically indexed array of places
    $places = [];

    // TODO: search database for places matching $_GET["geo"]
    
	// break geo out into components...
	$search = array(",", "+");
	$geo = str_replace($search, " ", $_GET["geo"]);
	
	$rows = query("SELECT * FROM `places` WHERE MATCH(postal_code,place_name,admin_name1,admin_code1) against (? IN NATURAL LANGUAGE MODE)", $geo);
	if ($rows !== FALSE)
	{
		$places = $rows;
	}
	
    // output places as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($places, JSON_PRETTY_PRINT));

?>