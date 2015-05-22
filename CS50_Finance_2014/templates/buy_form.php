<?php

    if(isset($post["symbol"]))
    {
        $symbol = $post["symbol"];
    }
    else
    {
        $symbol = "";
    }
    
?>

<form action="buy.php" method="post">
    <fieldset>
        Please enter the stock you wish to buy:
        <input type="text" name="symbol" placeholder="GOOG" value="<?= $symbol ?>">
        <br>
        Please enter the amount you wish to purchase:
        <input type="number" name="qty" placeholder="100" min="1">
        <br>
        <input type="submit" name="Buy">
    </fieldset>
</form>
