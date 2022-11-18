const validateEmail = (email) => {
  if (!email) {
    return false;
  }
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

module.exports = { validateEmail };
