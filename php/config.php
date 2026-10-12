<?php
// Database settings. XAMPP defaults: user "root", empty password.
// Change these when you upload to real hosting.
$DB_HOST = 'localhost';
$DB_NAME = 'aura_hous';
$DB_USER = 'root';
$DB_PASS = '';

function db() {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS;
    return new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER, $DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
}

function reply($ok, $msg, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(['ok' => $ok, 'message' => $msg]);
    exit;
}
