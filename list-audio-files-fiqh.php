<?php
header('Content-Type: application/json');

$directory = 'audio/alfiqh';
$files = [];
$audio_extensions = ['ogg', 'mp3', 'wav', 'm4a', 'aac', 'wma'];

if (is_dir($directory)) {
    $items = scandir($directory);
    foreach ($items as $item) {
        if ($item != "." && $item != "..") {
            $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            if (in_array($extension, $audio_extensions)) {
                $files[] = [
                    'name' => $item,
                    'extension' => $extension,
                    'path' => $directory . '/' . $item
                ];
            }
        }
    }
    // ترتيب الملفات حسب الاسم
    usort($files, function($a, $b) {
        return strnatcmp($a['name'], $b['name']);
    });
}

echo json_encode(array_values($files));
