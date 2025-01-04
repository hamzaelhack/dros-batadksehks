<?php
header('Content-Type: application/json');

$page = isset($_GET['page']) ? $_GET['page'] : 'aleaqida';
$directory = 'audio/' . $page;
$files = [];

if (is_dir($directory)) {
    $items = scandir($directory);
    foreach ($items as $item) {
        if ($item != "." && $item != ".." && pathinfo($item, PATHINFO_EXTENSION) == 'ogg') {
            $files[] = $item;
        }
    }
    // ترتيب الملفات حسب الاسم
    natsort($files);
}

echo json_encode(array_values($files));
