Start your day with focus and insight using Oral Starter, a web platform designed to boost your productivity. This application provides a customizable overview of your essential information, including recent unread emails, news relevant to your interests, and up-to-date market summaries. Seamlessly manage your daily and future tasks, and gain valuable insights into your progress with task completion analysis over time. Oral Starter empowers you to take control of your day from the moment you open it.

# Oral Starter: Your Personalized Productivity Hub

Welcome to Oral Starter! This platform is designed to be your go-to starting point for a productive day. It brings together essential information and tools to help you stay informed, organized, and focused.

## Features

* **Recent Unread Emails:** Quickly view unread emails from the past 24 hours (customizable duration).
* **Custom News Feed:** Stay updated on news within your specified domains.
* **Market Updates:** Get the latest market information relevant to your interests.
* **Task Management:** Easily create and manage tasks for the current day and future dates.
* **Task Analysis:** Track your task completion percentage based on different dates to understand your productivity trends.
* **Daily Inspirational Quotes:** Begin your day with a dose of motivation.

## Setup Instructions

To get Oral Starter up and running on your local machine, you need to configure the following environment variables. Create a `.env` file in the root directory of the project and add the following:

MONGO_URI=mongodb://127.0.0.1:27017/oral-starter

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

GOOGLE_REFRESH_TOKEN=YOUR_GOOGLE_REFRESH_TOKEN

JWT_SECRET=YOUR_JWT_SECRET_KEY

NEWS_API_KEY=YOUR_NEWS_API_KEY

FRONTEND_URL=http://localhost:5173

API_KEY_OF_STOCK=YOUR_STOCK_API_KEY


**Note:**

* Replace the placeholder values (e.g., `YOUR_GOOGLE_CLIENT_ID`) with your actual credentials and API keys.
* Ensure you have MongoDB installed and running.
* The `FRONTEND_URL` should point to the URL where your frontend application will be served.

## Further Development

This project is continuously evolving. Contributions and feedback are welcome!
