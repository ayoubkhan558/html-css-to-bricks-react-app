# Code2Bricks Test Cases & Improvements

## Test Cases - HTML/CSS Examples

### 1. Basic HTML Elements

#### Test Case 1.1: Simple Text Content
```html
<h1>Welcome to Code2Bricks</h1>
<p>This is a simple paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
<a href="https://example.com">Click here</a>
```

```css
h1 {
  color: #2c3e50;
  font-size: 32px;
  margin-bottom: 16px;
}

p {
  line-height: 1.6;
  color: #555;
}

strong {
  font-weight: 700;
}
```

**Expected Output**: Should convert headings, paragraphs, and inline elements properly.

---

#### Test Case 1.2: Images and Media
```html
<div class="image-container">
  <img src="https://via.placeholder.com/800x400" alt="Placeholder image" />
  <video controls>
    <source src="video.mp4" type="video/mp4">
  </video>
  <audio controls>
    <source src="audio.mp3" type="audio/mpeg">
  </audio>
</div>
```

```css
.image-container {
  max-width: 800px;
  margin: 0 auto;
}

img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
```

**Expected Output**: Media elements with proper attributes and styles.

---

### 2. Layout & Structure

#### Test Case 2.1: Flexbox Layout
```html
<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item">Item 2</div>
  <div class="flex-item">Item 3</div>
</div>
```

```css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #f5f5f5;
}

.flex-item {
  flex: 1;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

**Expected Output**: Proper flexbox settings in Bricks format.

---

#### Test Case 2.2: CSS Grid Layout
```html
<div class="grid-container">
  <div class="grid-item header">Header</div>
  <div class="grid-item sidebar">Sidebar</div>
  <div class="grid-item main">Main Content</div>
  <div class="grid-item footer">Footer</div>
</div>
```

```css
.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-gap: 16px;
  min-height: 100vh;
}

.header {
  grid-column: 1 / -1;
  background: #2c3e50;
  color: white;
  padding: 20px;
}

.sidebar {
  background: #ecf0f1;
  padding: 20px;
}

.main {
  padding: 20px;
}

.footer {
  grid-column: 1 / -1;
  background: #34495e;
  color: white;
  padding: 15px;
}
```

**Expected Output**: Grid layout with proper template columns/rows.

---

### 3. Navigation & Menus

#### Test Case 3.1: Horizontal Navigation
```html
<nav class="navbar">
  <a href="#" class="nav-link active">Home</a>
  <a href="#about" class="nav-link">About</a>
  <a href="#services" class="nav-link">Services</a>
  <a href="#contact" class="nav-link">Contact</a>
</nav>
```

```css
.navbar {
  display: flex;
  background-color: #333;
  padding: 0;
}

.nav-link {
  color: white;
  padding: 14px 20px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #555;
}

.nav-link.active {
  background-color: #04AA6D;
}
```

**Expected Output**: Nav element with hover states.

---

### 4. Forms & Input Elements

#### Test Case 4.1: Contact Form
```html
<form class="contact-form">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required placeholder="Your name">
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required placeholder="your@email.com">
  
  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="5" placeholder="Your message here..."></textarea>
  
  <button type="submit">Send Message</button>
</form>
```

```css
.contact-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.contact-form label {
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: 600;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.contact-form button {
  margin-top: 15px;
  padding: 12px 30px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.contact-form button:hover {
  background-color: #45a049;
}
```

**Expected Output**: Form elements with proper field mappings.

---

### 5. Tables

#### Test Case 5.1: Data Table
```html
<table class="data-table">
  <thead>
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Widget A</td>
      <td>$19.99</td>
      <td>In Stock</td>
    </tr>
    <tr>
      <td>Widget B</td>
      <td>$29.99</td>
      <td>Out of Stock</td>
    </tr>
  </tbody>
</table>
```

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
