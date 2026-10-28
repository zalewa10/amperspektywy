<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$topic = trim((string)($_POST['topic'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$consent = isset($_POST['consent']);
$honeypot = trim((string)($_POST['website'] ?? ''));

if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($name === '' || $email === '' || $topic === '' || $message === '' || !$consent) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Uzupełnij wymagane pola.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Podaj prawidłowy adres e-mail.']);
    exit;
}

$to = 'amperspektywy@gmail.com';
$subject = 'AM Perspektywy: ' . str_replace(["\r", "\n"], ' ', $topic);
$safeName = str_replace(["\r", "\n"], ' ', $name);
$safeEmail = str_replace(["\r", "\n"], ' ', $email);
$safePhone = str_replace(["\r", "\n"], ' ', $phone);
$safeTopic = str_replace(["\r", "\n"], ' ', $topic);

$body = "Nowa wiadomość z formularza kontaktowego\n\n";
$body .= "Imię i nazwisko: {$safeName}\n";
$body .= "E-mail: {$safeEmail}\n";
$body .= "Telefon: {$safePhone}\n\n";
$body .= "Temat: {$safeTopic}\n\n";
$body .= "Treść wiadomości:\n{$message}\n";

$headers = [
    'From: AM Perspektywy <formularz@amperspektywy.com>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Nie udało się wysłać wiadomości.']);
    exit;
}

echo json_encode(['ok' => true]);
