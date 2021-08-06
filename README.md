<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">Agrus</h3>

  <p align="center">
   	A Social Media MVP app based on reddit
    <br />
    <br />
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="https://github.com/siddharthroy12/Agrus/issues">Report Bug</a>
    ·
    <a href="https://github.com/siddharthroy12/Agrus/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
				<li><a href="#configuring">Configuring</a></li>
				<li><a href="#running">Running</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Agrus is a mvp app made using mern stack to prove my web dev skills

### Built With

* [ReactJS](https://reactjs.org/)
* [NodeJS](https://reactjs.org/)
* [MongoDB](https://www.mongodb.com/)
* [TypeScirpt](https://www.typescriptlang.org/)


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Make sure you have these install on your system
* [Git](https://nodejs.org/en/download/)
* [NodeJS](https://nodejs.org/en/download/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/siddharthroy12/Agrus
   ```
2. Install NPM packages
   ```sh
   npm install-all
   ```

### Configuring
Create a .env file at the root of the project and fill it with these

```
DB_URI=
JWT_SECRET=
NODE_ENV=development
IMGUR_CLIENT_ID=
```

To get the DB_URI go to mongodb atlas, create a free cluster and a database and the paste the URI here
To get the IMGUR_CLIENT_ID go to imgur, create a new application and paste the CLIENT_ID here

### Running

First start the backend

```
npm start
```

Then start the client
```
npm client
```
Use 0.0.0.0:3000 instead of localhost:3000 if you are uploading video through client


<!-- LICENSE -->
## License

Distributed under the MIT License.


<!-- CONTACT -->
## Contact

Siddharth Roy - [@Siddharth_Roy12](https://twitter.com/Siddharth_Roy12)

Project Link: [https://github.com/siddharthroy12/keepr](https://github.com/siddharthroy12/keepr)