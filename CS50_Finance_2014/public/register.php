<?php

    // configuration
    require("../includes/config.php");

    // if form was submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        if ($_POST["username"] == "")
        {
            apologize("Please enter a user name.");
        }
        if ($_POST["password"] == "")
        {
            apologize("Please enter a password.");
        }
        if ($_POST["password"] != $_POST["confirm"])
        {
            apologize("Your passwords don't match!");
        }
        $success = query("INSERT INTO users (username, hash, cash) VALUES(?, ?, 10000.00)", $_POST["username"], crypt($_POST["password"]));
        if ($success === false)
        {
            apologize("Please choose a different username.");
        }
        $rows = query("SELECT LAST_INSERT_ID() AS id");
        $id = $rows[0]["id"];
        $_SESSION = ["id" => $id];
        redirect("index.php");
    }
    else
    {
        // else render form
        render("register_form.php", ["title" => "Register"]);
    }

?>
