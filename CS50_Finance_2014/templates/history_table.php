<div>
    <table style="width: 100%;">
        <thead>
            <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <?php $iteration = 0; foreach ($positions as $position):; ++$iteration; ?>
            
            <tr class="<?= $iteration & 1 ? 'odd' : 'even' ?>">
                <td><?= $position["date"] ?></td>
                <td><?= $position["action"] ?></td>
                <td class="name"><?= $position["name"] ?></td>
                <td><?= $position["symbol"] ?></td>
                <td class="number"><?= $position["shares"] ?></td>
                <td class="price"><?= money_format(MONEY, $position["price"]) ?></td>
                <td class="price"><?= money_format(MONEY, ($position["shares"] * $position["price"])) ?></td>
            </tr>
            
            <?php endforeach ?>
        </tbody>
    </table>
</div>

