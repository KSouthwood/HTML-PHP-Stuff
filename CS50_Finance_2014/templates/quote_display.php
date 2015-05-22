<?php
    $price = number_format($stock["price"], 2);
?>

<div>
    <table class="quote">
        <col style="width: 20%;">
        <col style="width: 60%;">
        <col style="width: 20%;">
        <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
        </tr>
        <tr>
            <td><?= $stock["symbol"] ?></td>
            <td class="name"><?= $stock["name"] ?></td>
            <td class="price"><?= money_format(MONEY, $price) ?></td>
        </tr>
    </table>
</div>

<br>

<form action="buy.php" method="post">
    <fieldset>
        <div class="form-group">
            <button type="submit" name="symbol" value="<?= $stock["symbol"] ?>">Buy this stock</button>
        </div>
    </fieldset>
</form>
