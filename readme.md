# **FINANCIAL PORTFOLIO MANAGEMENT SYSTEM - BACK-END PROJECT DOCUMENTATION** #

### **_Project Overview_** ###
This application aims to create a financial portfolio management system with features such as transaction handling, portfolio calculation and user authentication. The application allows users to create transaction, see their current balance, check their portfolio status and review their transaction history.

### **_Dependencies_** ###
* **Node.js :** The project is built by using Node.js for all the server side developments.
* **Express.js :** All the API's are built using express.js.
* **MongoDB :** As a NoSQL database, it is very efficient for storing and managing data.  
* **JWT Authentication :** JSON Web Token (JWT) authentication system is used to ensure secure data sessions.
* **DOTNEV :** All the configuration variables, passwords etc are isolated using dotenv library. 
* **Crypto :** Crypto is being used for encrypting the passwords for storing it to the database.
* **RESTAPI :** RESTAPI architecture is followed throughout the application.

### **_Scope And Objectives_** ###
* #### **Scope :-** ####
  
  * This application focuses on managing financial portfolios through robust transaction handling and portfolio calculations.

  * It includes features for manual transaction record, automatic balance update of the user, automatic portfolio generation of the user. 

* #### **Objectives :-** #### 
  
  * Enable users to manage financial transactions securely, calculate portfolio values accurately.
  * Support users in planning for future financial goals.
  * Maintain the security and privacy for each users information.

### **_Features_** ###
  
  * #### **Efficient Database -** ####
    * The database used in this application - **"MONGODB"** is one of the best and trending nosql databases in today's world.
  
  * #### **RESTAPI** ####
    * All the API endpoints are in complete sync with the RESTApi method.
  
  * #### **Encrypting Password** ####
    * The password given by the user is encrypted before storing it to the database, establishing a very secure environment for the  user.
  
  * #### **Login Token** ####
    * The user is given a token at the time of login by which the user can login without sharing the password each time.


### **_Setup_** ###

* Copy the **".env.example"** file and rename it as **".env"**. Modify the values as needed per requirements.
* run the code **_npm init_** or **_npm i_** from the root directory.


