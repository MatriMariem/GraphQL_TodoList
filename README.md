# Todo List Backend
**This is a Backend for a Todo list application, using GraphQL, MongoDB, NodeJs, Express, jwt-redis...**

## DEMO
https://drive.google.com/file/d/17SdwRvd7Cd4zB1ZTjhEY_3KeGQHVSExN/view?usp=sharing, https://drive.google.com/file/d/19sKH1PWsXkrSkc2MqM74uDRu9x9j1juE/view?usp=sharing, https://drive.google.com/file/d/1YZjJQPVgShuWV_1kDcCpKgzYHCOPnDqJ/view?usp=sharing, https://drive.google.com/file/d/1euEKGmdl3-rShqUqDc7Zy-yHp0pR9MAJ/view?usp=sharing, https://drive.google.com/file/d/1qiq27tFB5cZkHJ7vGKLgel4oLKLgaNey/view?usp=sharing, https://drive.google.com/file/d/1u_EWMW6mvQpfFC_Wko3buQrMI7xwQfDk/view?usp=sharing
## USAGE
You can try the API by following these steps:
> **Step 1:** Clone my repository using this command, (you need to have git installed on your machine first)
````
git clone https://github.com/MatriMariem/GraphQL_TodoList.git
````
> **Step 2:** Change directory to GraphQL_TodoList:
````
cd GraphQL_TodoList
````
> **Step 3:** Install all dependencies (you need to have npm and node installed on your machine):
````
npm i
````
> **Step 4:** Run the application
````
npm start
````
> **Step 5:** Open this URL http://localhost:3000/ in your browser
***
> **Step 6:** Make your desired queries (Please check the 'Examples of Usage' part or watch my demo)
***
> **Step 7:** In order to stop the application from running, press Control and c.
````
Crtl+c
````

## Models
This backend contains 3 data models: User model, Task model and Comment model.
- **User Model** contains the following subfields: username, email, password, tasks, sharedTasks and comments.
- **Task Model** contains the following subfields: content, createdBy, sharedWith, comments, done.
- **Comment Model** contains the following subfields: content, createdBy, createdIn, createdAt.

## Essential operations:
There are 2 main types of operations:
- **query** operations that are equivalent to GET requests in a RESTful API
- **mutation** operations that are equivalent to POST, PUT and DELETE requests in a RESTful API

## 'query' operations
- **users** returns an array of all users
- **user(username)** return the user object
- **tasks(userId)** returns an array of all tasks owned by that user
- **comments(taskId)** returns an array of all comments written in that task
- **login(email, password)** returns an object of user Id and a jwt-redis token for authentication
- **logout** logs out the connected user

## 'mutation' operations
- **signUp(username, email, password)** creates a new user and returns the created user object
- **addTask(taskContent)** creates a new task for the connected user and returns the created task object
- **shareTask(userId, taskId)** shares an existing task with another user and returns the task object
- **editTask(taskId, taskContent)** edits the task content and returns the task object
- **commentTask(taskId, commentContent)** adds a new comment to a task and returns the task object
- **checkTask(taskId)** switched the status of a task (completed/uncompleted) and returns the task object
- **deleteTask(taskId)** deletes a task and returns it
- **deleteComment(commentId)** deletes a comment and returns it

## Authentication and Authorization
**Authentication was implemented using jwt-redis***
- **non connected users** can get the list of users, tasks and comments. they also can create an account and login.
- **connected users** can also create, edit, comment and switch the status of their own tasks. They can also share their tasks with other users.
  - **only owners of a task** can delete that task
  - **only owners and users who have a task shared with them** can edit, comment, switch the status and share the tasks with other users
  - **only owners of a comment** can delete their comment

## Examples of Usage
**Please don't forget that by using GraphQL, you can ask for all subfields you want, as long as these subfields exist. you can also limit your query subfields number. That means you don't need to ask for all the subfields that are shown in my examples.**
### Create an account
````
mutation {
  signUp (username: "mariemmatri", email: "meriemmatri1994@gmail.com", password: "fake password") {
    _id
    username
    email
  }
}
````
This operation will return the _id, username and email of the newly created user.

### Login
````
query {
  login (email: "meriemmatri1994@gmail.com", password: "fake password"){
    userId
    token
  }
}
````
You must copy the returned token value and add it as a value to a custom request header called 'auth-token' in order to be able to connect with that user when you make your next request.  
for example:  
**auth-token:**   **eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGE1MmViNjcyNjdkYjE0OTM1NDE1YjgiLCJqdGkiOiJYMUdFbzNabTZ3IiwiaWF0IjoxNjIxNDM4MTc5fQ.0yedTLJiuvJVafcpYvP8NunnfyMh4qBSJ8YEcifLyHs**  
In order to create a custom request header, you can use several extensions, such as postman and ModHeader.
### Create a new task
**(make sure you are connected using the token!)**
````
mutation {
  addTask (taskContent: "Learn GraphQL") {
    _id
    content
    createdBy {
      username
    }
    done
  }
}
````
### Share a task
**(you can do this only if you are the owner of that task or you have that task shared with you)**
````
mutation {
  shareTask (userId: "60a4f701dd0a143543ba8089", taskId: "60a4c702bb0a143543ba7098") {
    _id
    content
    createdBy {
      username
    }
    sharedWith {
      _id
      username
    }  
    done
  }
}
````
**make sure you use valid IDs!**
### Edit a task
**(you can do this only if you are the owner of that task or you have that task shared with you)**
````
mutation {
  editTask (taskId: "60a4f701dd0a143543ba8089",taskContent: "Learn Laravel and PHP") {
    _id
    content
    createdBy {
      username
    }
    sharedWith {
      username
    }
    comments {
      content
    }
    done
  }
}
````
**make sure you use valid IDs!**
### Mark a task as completed or uncompleted
**(you can do this only if you are the owner of that task or you have that task shared with you)**
````
mutation {
  checkTask (taskId: "60a4f6cadd0a143543ba8088") {
    _id
    content
    done
  }
}
````
**notice how the "done" boolean attribute changes everytime you make the request**
### Comment a task
**(you can do this only if you are the owner of that task or you have that task shared with you)**
````
mutation {
  commentTask (taskId: "60a4f6cadd0a143543ba8088",commentContent: "GraphQL is super fun!") {
    _id
    content
    createdBy {
      username
    }
    comments {
      _id
      content
      createdBy {
        _id
        username
      }
    }
    done
  }
}
````

### Delete a comment
**(you can do this only if you are the owner of that comment)**
````
mutation {
  deleteComment (commentId: "60a8e5cadd0a143543ac7795") {
    _id
    content
}
````
### Delete a task (you can do this only if you are the owner of that task)
````
mutation {
  deleteTask (taskId: "60a4f701dd0a143543ba8089") {
    _id
    content
}
````

### Get all users
**(this operation is allowed for both connected and non connected users)**
````
query {
  users {
    _id
    email
    username
    tasks {
      content
      comments {
        content
        createdBy {
          username
        }
      }
    }
    sharedTasks {
      content
      createdBy {
        username
      }
    }
    comments {
      content
    }
  }
}
````

### Get all details about a user by username
**(this operation is allowed for both connected and non connected users)**
````
query {
  user (username:"mariemmatri") {
    _id
    email
    username
    tasks {
      content
      comments {
        content
        createdBy {
          username
        }
      }
    }
    sharedTasks {
      content
      createdBy {
        username
      }
    }
    comments {
      content
    }
  }
}
````

### Get all tasks of a user
**(this operation is allowed for both connected and non connected users)**
````
query {
  tasks (userId: "60a4f701dd0a143543ba8089") {
    _id
    content
    sharedWith {
      username
    }
    comments {
      content
    }
  }
}
````

### Get all comments of a task
**(this operation is allowed for both connected and non connected users)**
````
query {
  comments (taskId: "60a4f6cadd0a143543ba8088") {
    _id
    content
    createdBy {
      username
    }
    createdIn {
      content
      createdBy {
        username
      }
    }
  }
}
````

### Logout
**make sure the token is sent in the request in order to invalidate it**
````
query {
  logout
}
````
