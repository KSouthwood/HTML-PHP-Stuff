<?php

    // configuration
    require("../includes/config.php");
    
    // if form was submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        // Check if a stock symbol was entered.
        if ($_POST["symbol"] == "")
        {
            apologize("Please enter a stock symbol.");
        }
        
        // Make sure the user owns the stock...
        $owns = query("SELECT * FROM holdings WHERE id = ? AND symbol = ?", $_SESSION["id"], $_POST["symbol"]);

        // Check if the lookup was successful
        if (empty($owns))
        {
            apologize("Sorry, I couldn't find that stock symbol!");
        }
        
        $stock = lookup($_POST["symbol"]);
        
        if ($stock === false)
        {
            apologize("I didn't find that stock!");
        }
        
        $cost = $owns[0]["qty"] * $stock["price"];
        
        if (query("DELETE FROM holdings WHERE id = ? and symbol = ?", $_SESSION["id"], $_POST["symbol"]) === false)
        {
            apologize("Error removing stock from holdings!");
        }
        
        if (query("UPDATE users SET cash = cash + ? WHERE id = ?", $cost, $_SESSION["id"]) === false)
        {
            apologize("Error adding cash to account!");
        }
        
        if (query("INSERT INTO history (id, action, symbol, shares, price, date) VALUES (?,?,?,?,?,NOW())", 
            $_SESSION["id"], "SELL", $stock["symbol"], $owns[0]["qty"], $stock["price"]) === false)
        {
            apologize("Error adding transaction to history.");
        }
        
        $sold = [
            "symbol" => $_POST["symbol"],
            "name" => $stock["name"],
            "price" => $stock["price"],
            "cost" => $cost,
            "qty" => $owns[0]["qty"]
            ];
                
        // Display success of the sell.
        render("sell_success.php", ["title" => "Sold stock", "sold" => $sold]);

    }
    else
    {
        // get users portfolio
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
    
        // render portfolio
        render("sell_form.php", ["positions" => $positions, "title" => "Sell stock"]);
    }
?>
