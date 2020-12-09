DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trakerDB;

USE employee_trackerDB;

CREATE TABLE department(
  id INTEGER AUTO_INCREMENT,
  name VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id)
  );

  CREATE TABLE role(
    id INTEGER NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
  );

  CREATE TABLE employee(
    id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NOT NULL, 
    PRIMARY KEY(id)
  );
 
DELETE FROM department WHERE id = department_id 


UPDATE FROM manager WHWERE id = manger_id 

  