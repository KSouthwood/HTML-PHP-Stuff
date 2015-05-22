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
        
        // Lookup the provided stock symbol
        $stock = lookup($_POST["symbol"]);
        
        // Check if the lookup was successful
        if ($stock === false)
        {
            apologize("Sorry, I couldn't find that stock symbol!");
        }
        
        // Display the quote for the stock.
        render("quote_display.php", ["stock" => $stock, "title" => "Stock quote"]);
    }
    else
    {
        // else render form
        render("quote_form.php", ["title" => "Get a stock quote"]);
    }

?>
