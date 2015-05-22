<?php
    $price = number_format($stock["price"], 2);
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
        <td><?= $stock["symbol"] ?></td>
        <td><?= $stock["name"] ?></td>
        <td class="price">$<?= $price ?></td>
    </tr>
</table>

<p>
    Congratulations! You just bought <?=$post["qty"] ?> shares of <?= $stock["name"] ?> for a total cost of <?= money_format('%n', $cost) ?>!
</p>

