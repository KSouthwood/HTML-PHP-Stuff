<?php

    // configuration
    require("../includes/config.php");

    // if form was submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        // Is password_old empty?
        if ($_POST["password_old"] == "")
        {
            apologize("Please enter your old password.");
        }
        
        // Is password_new or confirm empty?
        if (($_POST["password_new"] == "")  || ($_POST["confirm"] == ""))
        {
            apologize("Please enter your new password in both fields.");
        }
        
        // Do password_new and confirm match each other?
        if ($_POST["password_new"] != $_POST["confirm"])
        {
            apologize("Your new password doesn't match! Please re-enter again.");
        }
        
        // We have values in all fields, now we compare against the database
        // Get the user's current password hash and compare it to password_old
        $rows = query("SELECT hash FROM users WHERE id = ?",$_SESSION["id"]);

        if (crypt($_POST["password_old"], $rows[0]["hash"]) !== $rows[0]["hash"])
        {
            apologize("Your old password doesn't match your current password.");
        }
        
        // Update the hash in the table printing an error should an error occur
        if (query("UPDATE users SET hash = ? WHERE id = ?",crypt($_POST["password_new"]),$_SESSION["id"]) === false)
        {
            apologize("I couldn't update your password.");
        }
        
        render("change_success.php", ["title" => "Password changed!"]);
    }
    else
    {
        // else render form
        render("change_password_form.php", ["title" => "Change Password"]);
    }

?>

