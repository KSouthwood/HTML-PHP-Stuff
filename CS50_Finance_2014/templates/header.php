<!DOCTYPE html>

<html>
    
    <head>

        <link href="css/bootstrap.min.css" rel="stylesheet"/>
        <link href="css/bootstrap-theme.min.css" rel="stylesheet"/>
        <link href="css/styles.css" rel="stylesheet"/>

        <?php if (isset($title)): ?>
            <title>C$50 Finance: <?= htmlspecialchars($title) ?></title>
        <?php else: ?>
            <title>C$50 Finance</title>
        <?php endif ?>

        <script src="js/jquery-1.10.2.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/scripts.js"></script>

    </head>

    <body>

        <div class="container">

            <div id="top">
                <a href="/"><img alt="C$50 Finance" src="../public/img/logo.gif"/></a>
            </div>
            
            <?php if (isset($_SESSION["id"])): ?>
            <div id="navlist">
                <ul>
                    <!-- <li><a href="index.php"><?= $_SESSION["name"] ?>'s Portfolio</a></li> -->
                    <li><a href="/public/index.php">Portfolio</a></li>
                    <li><a href="/public/sell.php">Sell</a></li>
                    <li><a href="/public/buy.php">Buy</a></li>
                    <li><a href="/public/quote.php">Quote</a></li>
                    <li><a href="/public/history.php">History</a></li>
                    <li><a href="/public/funds.php">Funds</a></li>
                    <li><a href="/public/change_password.php">Change Password</a></li>
                    <li><a href="/public/logout.php">Log Out</a></li>
                </ul>
            </div>
            <?php endif ?>
            
            <div id="middle">
