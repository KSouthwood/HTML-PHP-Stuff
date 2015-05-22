<?php

    // configuration
    require("../includes/config.php");
    
    // if form was submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {    
        // on POST, check if we have an amount, displaying an error otherwise
        if (empty($_POST["funds"]))
        {
            apologize("You need to enter an amount to deposit or withdraw.");
        }
        
        if (empty($_POST["method"]))
        {
            apologize("You need to specify if we are depositing or withdrawing money.");
        }
        
        // check variable - did they choose add or subtract
        switch($_POST["method"])
        {
            // if add, update user's cash adding amount in funds
            case 'deposit':
                if (query("UPDATE users SET cash = cash + ? WHERE id = ?",$_POST["funds"],$_SESSION["id"]) === false)
                {
                    apologize("I couldn't add the funds to your account!");
                }
                
                break;
        
            // if subtract, compare user's cash with funds
            case 'withdraw':
                // get cash for the current user
                $rows = query("SELECT cash FROM users WHERE id = ?", $_SESSION["id"]);
                
                // make sure we're not withdrawing more than is available
                if ($_POST["funds"] > $rows[0]["cash"])
                {
                    apologize("You don't have that much money available. Maybe sell some stock?");
                }
                
                // subtract the funds from the users account
                if (query("UPDATE users SET cash = cash - ? WHERE id = ?", $_POST["funds"], $_SESSION["id"]) === false)
                {
                    apologize("I couldn't withdraw the funds from your account!");
                }
                
                break;
        }
        
        render("funds_success.php", ["title" => "Funds"]);
    }
    
    // display form
    else
    {
        render("funds_form.php", ["title" => "Fund Management"]);
    }
?>
