<?php
function getPDO() {
    $pdo = new PDO(
        'mysql:host=localhost;port=3306;dbname=alyka_woodcraft',
        'root', ''
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
}
