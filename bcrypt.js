const bcrypt = require('bcrypt');

const hashPass = async (pw) => {
  // const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(pw, 12);
  // console.log(salt);
  console.log(hash);
}

const login = async (pw, hashedPw) => {
  const result = await bcrypt.compare(pw, hashedPw);
  if (result) {
    console.log("Logged in successfully");
  } else {
    console.log('Incorrect');
  }
 }

login('penis', '$2b$12$qvTmgeVuAtPpv9PHbWca8OOdZU2Cn8SUPhz7v5gwjsOTK8XNGrDVa');
// hashPass('penis');