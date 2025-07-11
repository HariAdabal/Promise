# Name Search Application

A responsive web application that demonstrates:

- Random name generation
- Real-time search with debouncing
- Scroll-to-top functionality
- Keystroke and search counters

## Features

🔍 **Live Search with Debouncing**

- Searches update after 1 second of inactivity
- Tracks total keystrokes vs actual searches

📊 **Performance Counters**

- Displays total keystrokes
- Shows number of debounced searches executed

🔼 **Back-to-Top Button**

- Appears after scrolling 300px
- Smooth scroll animation

🎨 **Responsive Design**

- Works on mobile and desktop
- Clean, modern UI

## How It Works

1. **Name Generation**:

   - Combines random first/last name parts
   - Creates 200 unique names on load

2. **Search Functionality**:
   ```javascript
   function debounce(func, delay) {
     let timer;
     return function () {
       // Debounce logic here
     };
   }
   ```
