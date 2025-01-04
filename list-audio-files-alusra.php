<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$baseUrl = '/plays'; // Add this to match your web server configuration
$directory = 'audio/alusra';
$files = [];
$audio_extensions = ['mp3'];

if (is_dir($directory)) {
    $items = scandir($directory);
    foreach ($items as $item) {
        if ($item != "." && $item != "..") {
            $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            if (in_array($extension, $audio_extensions)) {
                $fullPath = $directory . '/' . $item;
                if (file_exists($fullPath)) {
                    // Get file size and check readability
                    $size = filesize($fullPath);
                    if (!is_readable($fullPath)) {
                        error_log("Warning: File not readable: " . $fullPath);
                        continue;
                    }
                    
                    // Construct the web path
                    $webPath = $baseUrl . '/' . str_replace('\\', '/', $fullPath);
                    
                    $files[] = [
                        'name' => $item,
                        'path' => $webPath,
                        'extension' => $extension,
                        'type' => 'audio/mpeg',
                        'size' => $size,
                        'fullPath' => realpath($fullPath) // For debugging
                    ];
                }
            }
        }
    }
    
    // Sort files numerically
    usort($files, function($a, $b) {
        preg_match('/(\d+)/', $a['name'], $aMatch);
        preg_match('/(\d+)/', $b['name'], $bMatch);
        
        $aNum = isset($aMatch[1]) ? intval($aMatch[1]) : 0;
        $bNum = isset($bMatch[1]) ? intval($bMatch[1]) : 0;
        
        return $aNum - $bNum;
    });

    // Add debug information
    $debug = [
        'baseDirectory' => realpath($directory),
        'webRoot' => $_SERVER['DOCUMENT_ROOT'],
        'scriptPath' => __FILE__,
        'files' => $files
    ];
    
    echo json_encode($debug);
} else {
    header('HTTP/1.1 404 Not Found');
    echo json_encode([
        'error' => 'Directory not found',
        'path' => realpath($directory),
        'current_dir' => getcwd()
    ]);
    exit;
}
