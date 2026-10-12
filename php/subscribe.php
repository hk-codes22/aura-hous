<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(false, 'Invalid request.', 405);

$email = trim($_POST['email'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply(false, 'Please enter a valid email.', 400);

try {
    $stmt = db()->prepare('INSERT INTO subscribers (email) VALUES (?)');
    $stmt->execute([$email]);
    reply(true, 'Thanks for subscribing!');
} catch (PDOException $e) {
    if ($e->getCode() == 23000) reply(true, 'You are already subscribed.'); // duplicate email
    reply(false, 'Something went wrong. Try again later.', 500);
}
