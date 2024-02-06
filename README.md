# rainyCloud

A web app built to provide online storage services. The motivation for this project came about when I wanted a Cloud storage platform for small businesses that is secure, safe, and simple.  

## Table of Contents
- <a href="#installation">Installation</a>
- <a href="#usage">Usage</a>
- <a href="#demo">Demo</a>
- <a href="#features">Features</a>

## Installation
## Installation using node
- clone this repo using ``git clone https://github.com/Arnj121/rainyCloud.git``
- clone the **fonty** repo using ``git clone https://github.com/Arnj121/fonty.git``
- see the readme file for **fonty** to get started.
- Download and install [**mongoDB**](https://www.mongodb.com/try/download/community) community server.
- start the Mongodb server using ``mongod --dbpath <data directory>``
- start the server using ``node app``
- access the web app on [https://localhost:2000/](https://localhost:2000/)
## Installation using docker.
- Install [MongoDB](https://www.mongodb.com/try/download/community) Community server by selecting your Operating System.
- Download [docker](https://www.docker.com/products/docker-desktop/)
- Start the docker desktop and the docker engine.
- Download the [fonty](https://drive.google.com/file/d/1jK41LPtjr27-7bH_ZFq-6-eKSxzHDju8/view?usp=sharing) image and [rainycloud](https://drive.google.com/file/d/1jD-dl6wiiCHY_ZMaH_D3T7bclX8Yx7D1/view?usp=sharing) image
- Navigate to the downloaded folder and open the terminal
- Do ``docker load --image <name of .tar file>`` for both the images.
- Start MongoDB.(see <a href='#installation'>Installation</a> section of MongoDB).
- Start the images using ``docker run -d -p 2045:2045 fonty`` and ``docker run -d -p 4000:4000 rainycloud``
- In a browser, type <a href='http://localhost:2000'>http://localhost:4000</a> to start the app.
## Demo
- please follow this [link](https://drive.google.com/file/d/1DCdU-5MT5oVX2zEz2f3MRuceeIw4wD0W/view?usp=drive_link) to view the demo.

## Features
- Allows file uploading and downloading of any type.
- includes search and share options.
- data storage analysis dashboard.
- allows editing of files and viewing media files.
