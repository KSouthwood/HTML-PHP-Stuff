<?php

	require (__DIR__ . "/../includes/config.php");
	
	// numerically indexed array of places
	$places = [];
	
	// break geo out into components...
	$search = array(",", "+");
	$geos = array_filter(explode(" ", str_replace($search, " ", $_GET["geo"])));
	
	// query the database using each element in $geo
	foreach ($geos as $geo) {
		$geo = "%" . $geo . "%";
	
		$places = $places + query("SELECT * FROM `places` WHERE `postal_code` LIKE '$geo' UNION
					SELECT * FROM `places` WHERE `place_name` LIKE '$geo' UNION
					SELECT * FROM `places` WHERE `admin_name1` LIKE '$geo' UNION
					SELECT * FROM `places` WHERE `admin_code1` LIKE '$geo' UNION
					SELECT * FROM `places` WHERE `admin_name2` LIKE '$geo' 
					ORDER BY `id` ASC LIMIT 1000");
	}
	
	// output places as JSON (pretty-printed for debugging convenience)
	header("Content-type: application/json");
	print(json_encode($places, JSON_PRETTY_PRINT));
?>