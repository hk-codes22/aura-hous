<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(false, 'Invalid request.', 405);

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $subject === '' || $message === '') reply(false, 'Please fill in all fields.', 400);
if (!filter_var($email, FILTER_VALIDATE_EMAIL))         reply(false, 'Please enter a valid email.', 400);
if (strlen($message) > 2000)                            reply(false, 'Message is too long.', 400);

try {
    $stmt = db()->prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $email, $subject, $message]);
    reply(true, 'Message sent! We will reply soon.');
} catch (PDOException $e) {
    reply(false, 'Something went wrong. Try again later.', 500);
}
