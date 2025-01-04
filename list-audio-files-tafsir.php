<?php
header('Content-Type: application/json');

$directory = 'audio/tafsir';
$files = [];
$audio_extensions = ['ogg', 'mp3', 'wav', 'm4a', 'aac', 'wma', 'mp4', 'opus'];

if (is_dir($directory)) {
    $items = scandir($directory);
    foreach ($items as $item) {
        if ($item != "." && $item != "..") {
            $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            if (in_array($extension, $audio_extensions)) {
                $files[] = [
                    'name' => $item,
                    'path' => $directory . '/' . $item,
                    'extension' => $extension
                ];
            }
        }
    }
    // ترتيب الملفات حسب الاسم
    usort($files, function($a, $b) {
        return strnatcmp($a['name'], $b['name']);
    });
}

echo json_encode($files);
