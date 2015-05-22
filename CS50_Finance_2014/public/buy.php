<?php

    // configuration
    require("../includes/config.php");
    
    // if form was submitted
    if (($_SERVER["REQUEST_METHOD"] == "POST") && ($_SERVER["HTTP_REFERER"] == "http://pset7/buy.php"))
    {
        // Check if a stock symbol was entered.
        if ($_POST["symbol"] == "")
        {
            apologize("Please enter a stock symbol.");
        }
        
        // Check if a valid quantity was entered
        if ($_POST["qty"] < 1)
        {
            apologize("Please enter a quantity of 1 or more.");
        }
        
        // Make sure we have a non-negative integer for quantity
        if (!(preg_match("/^\d+$/", $_POST["qty"])))
        {
            apologize("Please enter a whole quantity.");
        }
        
        // Lookup the provided stock symbol
        $stock = lookup($_POST["symbol"]);
        
        // Check if the lookup was successful
        if ($stock === false)
        {
            apologize("I couldn't find that stock symbol!");
        }
        
        $rows = query("SELECT cash FROM users WHERE id = ?", $_SESSION["id"]);
        $cost = $_POST["qty"] * $stock["price"];
        
        if ($cost > $rows[0]["cash"])
        {
            apologize("You don't have enough money to buy " . $_POST["qty"] . " shares of " . $_POST["symbol"] . "!");
        }
        
        // Subtract cash from users account
        if (query("UPDATE users SET cash = cash - ? WHERE id = ?", $cost, $_SESSION["id"]) === false)
        {
            apologize("We encountered an error!");
        }
        
        // Update users portfolio in holdings table
        $success = query("INSERT INTO holdings (id, symbol, qty) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE qty = qty + ?", $_SESSION["id"], $stock["symbol"], $_POST["qty"], $_POST["qty"]);
        
        if ($success === false)
        {
            apologize("Error encountered adding to portfolio!");
        }
        
        $success = query("INSERT INTO history (id, action, symbol, shares, price, date) VALUES (?,?,?,?,?,NOW())", $_SESSION["id"], "BUY", $stock["symbol"],
            $_POST["qty"], $stock["price"]);
        
        if ($success === false)
        {
            apologize("Error encountered entering transaction into history!");
        }
        
        // Display success of buy.
        render("buy_success.php", ["stock" => $stock, "post" => $_POST, "cost" => $cost, "title" => "Stock bought!"]);
    }
    else
    {
        // else render form
        render("buy_form.php", ["title" => "Buy stock", "post" => $_POST]);
    }

?>
