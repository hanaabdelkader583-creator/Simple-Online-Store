<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// 1. CONNECT TO 'store1_db'
$conn = new mysqli("localhost", "root", "", "store1_db");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection Failed: " . $conn->connect_error]));
}

$action = $_GET['action'] ?? '';

// --- 2. GET PRODUCTS ---
if ($action === 'get_products') {
    $result = $conn->query("SELECT * FROM products");
    $out = [];
    if ($result) {
        while($row = $result->fetch_assoc()) {
            $row['id'] = (int)$row['id'];
            $row['price'] = (float)$row['price'];
            $out[] = $row;
        }
    }
    echo json_encode($out);
    exit();
}

// --- 3. PLACE ORDER (The Fix) ---
if ($action === 'place_order' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $total = $_POST['total'] ?? 0;
    $details = $_POST['details'] ?? ''; 

    // Server-Side Validation
    if (empty($name) || empty($address)) {
        echo json_encode(["status" => "error", "message" => "Name and Address required"]);
        exit();
    }

    // Regex Check for Email
    if (!preg_match("/^[^\s@]+@[^\s@]+\.[^\s@]+$/", $email)) {
        echo json_encode(["status" => "error", "message" => "Invalid Email Format"]);
        exit();
    }

    // Insert Order
    $stmt = $conn->prepare("INSERT INTO orders (customer_name, customer_email, address, total_price, order_details) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssds", $name, $email, $address, $total, $details);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Order Placed Successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "SQL Error: " . $stmt->error]);
    }
    exit();
}
// --- 4. ADD PRODUCT ---
if ($action === 'add_product' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? 0;
    $image = $_POST['image'] ?? '';

    $stmt = $conn->prepare("INSERT INTO products (name, category, price, image) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssds", $name, $category, $price, $image);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Product Added!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    }
    exit();
}

// --- 5. UPDATE PRODUCT ---
if ($action === 'update_product' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? 0;
    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? 0;
    $image = $_POST['image'] ?? '';

    $stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=?, image=? WHERE id=?");
    $stmt->bind_param("ssdsi", $name, $category, $price, $image, $id);

    if ($stmt->execute()) echo json_encode(["status" => "success", "message" => "Updated!"]);
    else echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    exit();
}

// --- 6. DELETE PRODUCT ---
if ($action === 'delete_product' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? 0;
    $stmt = $conn->prepare("DELETE FROM products WHERE id=?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) echo json_encode(["status" => "success", "message" => "Deleted!"]);
    else echo json_encode(["status" => "error", "message" => "Error"]);
    exit();
}

// --- 7. LOGIN/REGISTER ---
if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $pass = $_POST['password'] ?? '';

    // Regex Validation
    if (!preg_match("/^[A-Za-z\s]+$/", $name)) {
        echo json_encode(["status" => "error", "message" => "Name must contain letters only"]);
        exit();
    }
    
    if (!preg_match("/^[^\s@]+@[^\s@]+\.[^\s@]+$/", $email)) {
        echo json_encode(["status" => "error", "message" => "Invalid Email Format"]);
        exit();
    }

    if (strlen($pass) < 6) {
        echo json_encode(["status" => "error", "message" => "Password too short (min 6 chars)"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $pass);
    if ($stmt->execute()) echo json_encode(["status" => "success", "message" => "Registered!"]);
    else echo json_encode(["status" => "error", "message" => "Email exists"]);
    exit();
}

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $pass = $_POST['password'] ?? '';
    $stmt = $conn->prepare("SELECT full_name FROM users WHERE email = ? AND password = ?");
    $stmt->bind_param("ss", $email, $pass);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($row = $res->fetch_assoc()) echo json_encode(["status" => "success", "message" => "Login Success", "user" => $row]);
    else echo json_encode(["status" => "error", "message" => "Invalid Login"]);
    exit();
}

$conn->close();
?>