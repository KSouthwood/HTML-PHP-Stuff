<?php

    require(__DIR__ . "/../includes/config.php");

    // numerically indexed array of places
    $places = [];

    // TODO: search database for places matching $_GET["geo"]
    // TODO: Implement multiple search when we have more than one word in geo (i.e. like city & state)
    
	// break geo out into components...
	$search = array(",", "+");
	$geo = str_replace($search, " ", $_GET["geo"]);
	
	if (is_numeric($geo))
	{
		$geo .= "%";
		$places = query("SELECT * FROM `places` WHERE `postal_code` LIKE '$geo' ORDER BY `postal_code` ASC");
	}
	else 
	{
		$geo = "%" . $geo . "%";
		$places = query("SELECT * FROM `places` WHERE `place_name` LIKE '$geo' UNION
			SELECT * FROM `places` WHERE `admin_name1` LIKE '$geo' ORDER BY `id` ASC");
	}
	
    // output places as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($places, JSON_PRETTY_PRINT));

?>