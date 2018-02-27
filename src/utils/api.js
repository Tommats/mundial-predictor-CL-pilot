var axios = require('axios');

  function newUser () {
    axios.post('/user', {
      email:'axiostest@example.com',
      password: 'tom123456'
    }).then(function (response) {
     return response;
    }).catch(function (error) {
    console.log(error);
    });
  }

newUser();
