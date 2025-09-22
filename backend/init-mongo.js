// MongoDB initialization script
// This runs when MongoDB container starts for the first time

db = db.getSiblingDB('devtoolkit');

// Create application user
db.createUser({
  user: 'devtoolkit_user',
  pwd: 'secure_password_change_this',
  roles: [
    {
      role: 'readWrite',
      db: 'devtoolkit'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

print('Database initialized successfully');