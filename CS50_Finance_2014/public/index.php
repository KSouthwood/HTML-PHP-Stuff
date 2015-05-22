<?php

    // configuration
    require("../includes/config.php"); 

    $rows = query("SELECT * FROM holdings WHERE id = ?", $_SESSION["id"]);
    
    $positions = [];
    foreach ($rows as $row)
    {
        $stock = lookup($row["symbol"]);
        if ($stock !== false)
        {
            $positions[] = [
                "name" => $stock["name"],
                "price" => $stock["price"],
                "shares" => $row["qty"],
                "symbol" => $row["symbol"]
            ];
        }
    }
    
    $rows = query("SELECT * FROM users WHERE id = ?", $_SESSION["id"]);
    $cash = $rows[0]["cash"];
    
    // render portfolio
    render("portfolio.php", ["positions" => $positions, "title" => "Portfolio", "cash" => $cash]);

?>
