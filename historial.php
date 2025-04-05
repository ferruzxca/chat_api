<?php
header("Content-Type: application/json");

// Conexión a tu base de datos en db4free.net
$host = "db4free.net";
$dbname = "chat_api";
$username = "ferruzca28";
$password = "ferr2812";

// Crear una conexión PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta para obtener las conversaciones únicas con el último mensaje
    $sql = "
        SELECT 
            LEAST(emisor_id, receptor_id) AS usuario1,
            GREATEST(emisor_id, receptor_id) AS usuario2,
            MAX(fecha_envio) AS ultima_fecha,
            SUBSTRING_INDEX(GROUP_CONCAT(mensaje ORDER BY fecha_envio DESC), ',', 1) AS ultimo_mensaje
        FROM 
            mensajes
        GROUP BY 
            LEAST(emisor_id, receptor_id), GREATEST(emisor_id, receptor_id)
        ORDER BY 
            ultima_fecha DESC
    ";

    $stmt = $pdo->query($sql);
    $conversaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($conversaciones);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
