import sqlite3
import os
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='.')

# --- DATABASE CONFIGURATION ---
DB_NAME = "store.db"

def init_db():
    """Initialize the SQLite database with required tables."""
    if not os.path.exists(DB_NAME):
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Create Users Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        
        # Create Products Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                image TEXT
            )
        ''')

        # Create Orders Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                email TEXT NOT NULL,
                address TEXT NOT NULL,
                total_amount REAL NOT NULL,
                details TEXT NOT NULL,
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insert Dummy Data for testing
        cursor.execute("INSERT OR IGNORE INTO products (id, name, category, price, image) VALUES (1, 'Classic Leather Wallet', 'Accessories', 45.00, 'https://images.unsplash.com/photo-1627123424574-18bd03b4e985?auto=format&fit=crop&w=500')")
        cursor.execute("INSERT OR IGNORE INTO products (id, name, category, price, image) VALUES (2, 'Running Sneakers', 'Shoes', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500')")
        cursor.execute("INSERT OR IGNORE INTO products (id, name, category, price, image) VALUES (3, 'Cotton T-Shirt', 'Clothes', 25.50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500')")
        cursor.execute("INSERT OR IGNORE INTO products (id, name, category, price, image) VALUES (4, 'Denim Jeans', 'Clothes', 55.00, 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500')")
        
        conn.commit()
        conn.close()
        print("Database initialized successfully.")

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # Allows accessing columns by name
    return conn

# --- ROUTES ---

# Serve the HTML files
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Main API Route to mimic server.php behavior
@app.route('/server.php', methods=['GET', 'POST'])
def server_logic():
    action = request.args.get('action')
    conn = get_db_connection()
    cursor = conn.cursor()
    response = {}

    try:
        # 1. GET PRODUCTS
        if action == 'get_products':
            cursor.execute('SELECT * FROM products')
            products = cursor.fetchall()
            # Convert row objects to list of dicts
            products_list = [dict(row) for row in products]
            return jsonify(products_list)

        # 2. REGISTER USER
        elif action == 'register':
            name = request.form.get('name')
            email = request.form.get('email')
            password = request.form.get('password')
            
            try:
                cursor.execute('INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)', 
                               (name, email, password))
                conn.commit()
                response = {"status": "success", "message": "Account created successfully!"}
            except sqlite3.IntegrityError:
                response = {"status": "error", "message": "Email already exists."}

        # 3. LOGIN USER
        elif action == 'login':
            email = request.form.get('email')
            password = request.form.get('password')
            
            cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
            user = cursor.fetchone()
            
            if user:
                response = {
                    "status": "success", 
                    "message": "Login successful", 
                    "user": {"full_name": user['full_name'], "email": user['email']}
                }
            else:
                response = {"status": "error", "message": "Invalid credentials"}

        # 4. PLACE ORDER
        elif action == 'place_order':
            name = request.form.get('name')
            email = request.form.get('email')
            address = request.form.get('address')
            total = request.form.get('total')
            details = request.form.get('details')

            cursor.execute('INSERT INTO orders (customer_name, email, address, total_amount, details) VALUES (?, ?, ?, ?, ?)',
                           (name, email, address, total, details))
            conn.commit()
            response = {"status": "success", "message": "Order placed successfully!"}

        # 5. ADMIN: ADD PRODUCT
        elif action == 'add_product':
            name = request.form.get('name')
            category = request.form.get('category')
            price = request.form.get('price')
            image = request.form.get('image')
            
            cursor.execute('INSERT INTO products (name, category, price, image) VALUES (?, ?, ?, ?)',
                           (name, category, price, image))
            conn.commit()
            response = {"status": "success", "message": "Product added!"}

        # 6. ADMIN: UPDATE PRODUCT
        elif action == 'update_product':
            pid = request.form.get('id')
            name = request.form.get('name')
            category = request.form.get('category')
            price = request.form.get('price')
            image = request.form.get('image')
            
            cursor.execute('UPDATE products SET name=?, category=?, price=?, image=? WHERE id=?',
                           (name, category, price, image, pid))
            conn.commit()
            response = {"status": "success", "message": "Product updated!"}

        # 7. ADMIN: DELETE PRODUCT
        elif action == 'delete_product':
            pid = request.form.get('id')
            cursor.execute('DELETE FROM products WHERE id=?', (pid,))
            conn.commit()
            response = {"status": "success", "message": "Product deleted!"}
            
        else:
            response = {"status": "error", "message": "Invalid action"}

    except Exception as e:
        response = {"status": "error", "message": str(e)}
    finally:
        conn.close()

    return jsonify(response)

if __name__ == '__main__':
    init_db() # Run DB setup once on start
    app.run(debug=True, port=5000)