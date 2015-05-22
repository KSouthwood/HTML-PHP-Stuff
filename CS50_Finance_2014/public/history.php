<?php

    // configuration
    require("../includes/config.php"); 

    $rows = query("SELECT * FROM history WHERE id = ?", $_SESSION["id"]);
    
    $positions = [];
    foreach ($rows as $row)
    {
        $stock = lookup($row["symbol"]);
        if ($stock !== false)
        {
            $positions[] = [
                "action" => $row["action"],
                "symbol" => $row["symbol"],
                "name" => $stock["name"],
                "shares" => $row["shares"],
                "price" => $row["price"],
                "date" => $row["date"]
            ];
        }
    }
    
    // render portfolio
    render("history_table.php", ["positions" => $positions, "title" => "History"]);

?>
