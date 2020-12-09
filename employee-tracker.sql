DROP DATABASE IF EXISTS employee-_trackerDB;
CREATE DATABASE employee_trakerDB;

USE employee_trackerDB;

CREATE TABLE department(
  id INTEGER NOT NULL,
  name VARCHARE(30)  NULL,
  PRIMARY KEY (id)
  );

  CREATE TABLE role(
    id INTEGER NOT NULL,
    title VARCHARE(30) NULL,
    salary DECIMAL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
  );

  CREATE TABLE employee(
    id INTEGER NOT NULL,
    firstname VARCHARE(30) NULL,
    lastname VARCHARE(30) NULL,
    role id INTEGER NOT NULL,
    manager_id INTEGER NOT NULL AUTO_ENCREMENT
    PRIMARY KEY (ID)
  );


  DELETE FROM employee_tracker WHERE manger = department 
  