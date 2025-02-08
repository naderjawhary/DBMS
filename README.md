To Run it:

1) Install node.js from https://nodejs.org/

2) Verify it works using the following commands:
    node --version
    npm --version

3) Install Project Dependencies:
    npm install

4) Start the Development Server:
    npm run dev
    open on localhost

Deploy to Server
1. Database Setup (Choose One)
Option A: MongoDB Compass

Install MongoDB Compass on your server
Keep your current connection string: mongodb://localhost:27017/athlete-diagnosis
Make sure MongoDB service is running on your server

Option B: MongoDB Atlas (If you prefer cloud database)

Go to MongoDB Atlas
Create free account and database
Get your connection string (looks like: mongodb+srv://username:password@cluster...)

2. Deploy on Railway

Create account on Railway
Connect your GitHub repository
Add environment variables in Railway:

MONGODB_URI=your_mongodb_uri
PORT=5000

If using Compass: MONGODB_URI=mongodb://localhost:27017/athlete-diagnosis
If using Atlas: Use the connection string from Atlas


Click Deploy
Railway will give you a URL where your app is running

Troubleshooting

If using MongoDB Compass: Make sure MongoDB is installed and running on your server
If database isn't connecting: Double-check your MongoDB connection string in Railway's environment variables
If you see a white screen: Verify your backend URL is correct


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
"# DBMS" 
