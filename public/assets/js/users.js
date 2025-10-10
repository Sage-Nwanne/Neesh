
  // Fake users ka data (ye hi tumhari "database" hai abhi)
  const users = [
    { email: "test@gmail.com", password: "123456" },
    { email: "admin@yahoo.com", password: "admin123" }
  ];

  // Helper functions
  function findUser(email) {
    return users.find(u => u.email === email);
  }

  function updatePassword(email, newPass) {
    const user = findUser(email);
    if (user) user.password = newPass;
  }

