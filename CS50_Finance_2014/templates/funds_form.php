<form action="funds.php" method="post">
    <fieldset>
        Amount of funds:
        <input type="number" name="funds" min="1">
        <br>
        <input type="radio" name="method" value="deposit">Deposit
        <input type="radio" name="method" value="withdraw">Withdraw
        <br>
        <input type="submit" value="Submit">
    </fieldset>
</form>
