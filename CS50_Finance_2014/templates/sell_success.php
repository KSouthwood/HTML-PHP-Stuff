<?php
    $price = number_format($sold["price"], 2);
?>

<table>
    <col style="width: 20%;">
    <col style="width: 60%;">
    <col style="width: 20%;">
    <tr>
        <th>Symbol</th>
        <th>Name</th>
        <th>Price</th>
    </tr>
    <tr>
        <td><?= $sold["symbol"] ?></td>
        <td><?= $sold["name"] ?></td>
        <td class="price">$<?= $price ?></td>
    </tr>
</table>

<p>
    Congratulations! You just sold <?=$sold["qty"] ?> shares of <?= $sold["name"] ?> for a total cost of <?= $sold["cost"] ?>!
</p>

