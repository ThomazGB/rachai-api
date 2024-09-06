db.createUser({
    user: 'admin',
    pwd: 'adminpassword',
    roles: [
      {
        role: 'readWrite',
        db: 'Rachai'
      }
    ]
  });