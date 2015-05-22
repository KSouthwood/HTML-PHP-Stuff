<div>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <?php $total = 0; $iteration = 0; foreach ($positions as $position):; ++$iteration; ?>
            
            <tr class="<?= $iteration & 1 ? 'odd' : 'even' ?>">
                <td class="name"><?= $position["name"] ?></td>
                <td><?= $position["symbol"] ?></td>
                <td class="number"><?= $position["shares"] ?></td>
                <td class="price"><?= money_format(MONEY, $position["price"]) ?></td>
                <td class="price"><?= money_format(MONEY, ($position["shares"] * $position["price"])) ?></td>
                <?php $total = $total + ($position["shares"] * $position["price"]) ?>
            </tr>
            
            <?php endforeach ?>
            
            <tr class="total">
                <td colspan = 2>Cash Balance = $<?= number_format($cash, 2) ?></td>
                <td colspan = 3>Total Portfolio = $<?= number_format($total, 2) ?></td>
            </tr>
        </tbody>
    </table>
</div>

