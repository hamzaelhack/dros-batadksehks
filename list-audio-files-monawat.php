<?php
header('Content-Type: application/json');

$directory = 'audio/monawat';
$files = [];

// Get all files in directory
if (is_dir($directory)) {
    $items = scandir($directory);
    foreach ($items as $item) {
        if ($item != "." && $item != "..") {
            $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            // Add file if it has an audio extension
            if (in_array($extension, [
                'mp3', 'wav', 'ogg',     // Common formats
                'm4a', 'aac', 'wma',     // Additional formats
                'mp4', 'opus', 'flac',   // More formats
                'aiff', 'wv', 'ape',     // High quality formats
                'mid', 'midi',           // MIDI formats
                'amr', '3gp', 'aa',      // Mobile formats
                'aax', 'act', 'alac',    // Other formats
                'oga', 'mogg', 'webm',   // Web formats
                'ra', 'rm', 'gsm',       // Legacy formats
                'dct', 'dvf', 'msv',     // Voice formats
                'raw', 'sln', 'vox'      // Raw formats
            ])) {
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
