<div>
    <form action="sell.php" method="post">
        <fieldset>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
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
                            <td><input type="radio" name="symbol" value="<?= $position["symbol"] ?>"></td>
                            <td class="name"><?= $position["name"] ?></td>
                            <td><?= $position["symbol"] ?></td>
                            <td class="number"><?= $position["shares"] ?></td>
                            <td class="price"><?= money_format(MONEY, $position["price"]) ?></td>
                            <td class="price"><?= money_format(MONEY, ($position["shares"] * $position["price"])) ?></td>
                        </tr>

                    <?php endforeach ?>
                </tbody>
            </table>
            <br>
            <div class="form-group">
                <button type="submit" class="btn btn-default">Sell</button>
            </div>
        </fieldset>
    </form>
</div>

