# Simple Online Store (Shop Hub)

A lightweight, full-stack e-commerce application built with Python (Flask) and SQLite. This project demonstrates a complete online store flow, from product browsing and cart management to a simulated checkout and admin dashboard.

## 📌 Project Overview
* **Phase I:** Frontend Design (HTML/CSS/JS).
* **Phase II:** Backend Implementation (Python/Flask + SQLite).
* **Goal:** To demonstrate the separation of concerns, AJAX asynchronous communication, and persistent database storage without using heavy frameworks.

## 🚀 Features
### User Side
* **Browse Products:** View products filtered by category (Accessories, Shoes, Clothes).
* **Shopping Cart:** Add items, update quantities, and remove items dynamically.
* **Checkout:** A simulated checkout process that validates user input and saves orders to the database.
* **Authentication:** User Login and Registration system.

### Admin Side
* **Dashboard:** View all current products.
* **Product Management:** Add, Edit, and Delete products.
* **Persistence:** All changes are saved instantly to the `store.db` SQLite database.

## 🛠️ Technologies Used
* **Frontend:** HTML5, CSS3, JavaScript (jQuery).
* **Backend:** Python 3, Flask.
* **Database:** SQLite3.
* **Data Transfer:** JSON & AJAX.

## ⚙️ How to Run the Project
Since this project uses a Python backend, you cannot simply open the HTML files. Please follow these steps:

### Prerequisites
* Python installed on your machine.

### Steps
1.  **Clone or Download** this repository.
2.  Open your terminal/command prompt in the project folder.
3.  **Install Flask** (if not installed):
    ```bash
    pip install flask
    ```
4.  **Run the Server:**
    ```bash
    python app.py
    ```
5.  **Open the Website:**
    * The terminal will show a local URL (usually `http://127.0.0.1:5000`).
    * Open that link in your browser.

## 📂 File Structure
* `app.py` - The main Python server file (handles routing and database logic).
* `store.db` - The SQLite database file (stores Users, Products, and Orders).
* `script.js` - Handles all frontend logic and AJAX requests.
* `style.css` - Contains all styling and responsive design rules.
* `admin.html` - The protected dashboard for managing inventory.

## 📝 Database Schema
The project automatically initializes a `store.db` file with three tables:
1.  **Products:** `id, name, category, price, image`
2.  **Users:** `id, full_name, email, password`
3.  **Orders:** `id, customer_name, email, total_amount, details`
