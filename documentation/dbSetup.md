# Summary of Configurations and Steps for Connecting Django to PostgreSQL with Environment Variables
This document outlines the process and configurations necessary for connecting a Django project to a PostgreSQL database using environment variables, focusing on the use of django-environ to handle sensitive settings like the database URL.
________________________________________
## 1. Prerequisites
Before starting, ensure that you have the following:
* PostgreSQL installed and running on your machine or on a remote server.
* A PostgreSQL database created for your Django project.
* The psycopg2 library installed for Django to interact with PostgreSQL.

To install the psycopg2 library, run the following command:

```pip install psycopg2```
________________________________________
## 2. Create a PostgreSQL Database in pgAdmin
*	Create a New Database:
1.	In the Object Browser on the left side, right-click on the Databases node.
2.	Choose Create -> Database.
3.	In the General tab, give your database a name (e.g., mydatabase).
4.	You can leave the owner as postgres or select another user if you have created one.
5.	Click Save to create the database.
*	Create a New Role/User (Optional):
1.	If you want to create a new user for your database, right-click on Login/Group Roles in the Object Browser.
2.	Choose Create -> Login/Group Role.
3.	Set a username (e.g., myuser) and assign a password.
4.	Under the Privileges tab, give the role permissions such as Can Create Database and Can Login.
5.	Assign this user to the database under the Properties tab by adjusting the Owner field or managing access privileges.

________________________________________
## 3. Using django-environ for Database Configuration
To securely manage your database credentials and environment-specific settings, we used the django-environ package. This allows you to define your database configuration in a .env file, which will be parsed by Django automatically.
Steps to install django-environ:

*	Install the package: 
```pip install django-environ```

*	Import and initialize django-environ in your settings.py: 

```
import environ
env = environ.Env()
```
________________________________________
## 4. Defining the Database Connection in .env
Instead of hardcoding database credentials directly in settings.py, we use a .env file to store the database URL, which will include the username, password, host, port, and database name.

Example of .env file:
```DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydatabase```

*	postgresql://: Specifies the database type (PostgreSQL).
*	myuser: The username created for PostgreSQL.
*	mypassword: The password for the user.
*	localhost: The host where PostgreSQL is running (e.g., localhost for local setups).
*	5432: The default port for PostgreSQL.
*	mydatabase: The name of the database to use.
________________________________________

## 5. Configuring Django to Use the Database URL

In ```settings.py```, we configure the ```DATABASES``` setting to read from the ```DATABASE_URL``` in the ```.env``` file.

Example configuration in settings.py :
```
DATABASES = {
•	'default': env.db('DATABASE_URL', default='postgresql://postgres:password@localhost:5432/mydatabase')* }
•	env.db('DATABASE_URL'): This tells Django to read the database configuration from the DATABASE_URL environment variable in the .env file.
•	default: If the DATABASE_URL variable is not found, the specified default URL will be used.
}
```
________________________________________
## 6. How It Works: Parsing the Connection URL
The connection URL in the .env file contains all the necessary parameters (username, password, host, port, and database name) for connecting to the PostgreSQL database. django-environ automatically parses this URL and configures Django’s DATABASES setting.

Explanation of the connection URL:
```postgresql://myuser:mypassword@localhost:5432/mydatabase```

*	**postgresql://**: Specifies the database engine (PostgreSQL).
*	**myuser**: The database username.
*	**mypassword**: The password for the PostgreSQL user.
*	**localhost**: The server where PostgreSQL is running (usually localhost for local setups).
*	**5432**: The default port for PostgreSQL.
*	**mydatabase**: The name of the database to use.

By using django-environ, Django automatically extracts these values without needing to manually specify them in the DATABASES dictionary.
________________________________________
## 7. Running Migrations to Set Up the Database
After setting up the database configuration, you can run the migrations to initialize your database with Django models:
```python manage.py migrate```
This will create the necessary tables and relationships in the database according to your Django models.
________________________________________
## 8. Creating a Superuser for the Admin Panel
Once the database is configured and migrations are run, you can create a superuser to access the Django admin panel.
```python manage.py createsuperuser```
This will prompt you to enter a username, email, and password for the superuser account.

*In this project superuser was created using python script.*
________________________________________
## 9. Accessing the Django Admin Panel
Once the superuser is created, you can log in to the Django admin panel by navigating to:
```http://127.0.0.1:8000/admin/```
You will be able to log in using the superuser credentials you just created.
________________________________________
## 10. Troubleshooting Common Issues
*	Missing or Incorrect Dependencies: Ensure that psycopg2 is installed to connect Django to PostgreSQL.
pip install psycopg2
*	Admin Panel Issues: If the admin panel appears distorted or broken, ensure the static files are correctly collected and applied:
python manage.py collectstatic
*	Database Connection: Verify the database URL in .env is correct and matches the settings in settings.py.
________________________________________

## Conclusion
By using django-environ, I streamlined the management of sensitive database credentials, making the project more secure and easier to maintain. The database connection string in the .env file ensures that we don't hardcode any sensitive information in the Django settings, while django-environ automatically parses and applies this configuration.
 
# Additional: 

## Create a PostgreSQL Database in CMD

*	Access the PostgreSQL command-line interface: 
```psql -U postgres```

*	Create a new database: 
```CREATE DATABASE mydatabase```

*	Create a new user and assign privileges: 

```
CREATE USER myuser WITH PASSWORD 'mypassword';
ALTER ROLE myuser SET client_encoding TO 'utf8';
ALTER ROLE myuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE myuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
```


*   Make sure to replace mydatabase, myuser, and mypassword with your preferred values.

