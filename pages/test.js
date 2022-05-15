// const jwt = require ('jsonwebtoken');
// const crypto = require('crypto');

// const token = crypto.randomBytes(3).toString('hex');

// const resetToken = jwt.sign({ token }, `process.env.JWT_SECRET`, {
//   expiresIn: '60s',
// });

// const isValid = jwt.verify(resetToken, `process.env.JWT_SECRET`);

// const newDate = Date.now() / 1000;
// const date = newDate.toPrecision(10)

// const tokens = { token: '630d42', iat: 1652621407, exp: 1652621467 };
// const tokenId = '630d42'
// console.log(token)
// console.log(isValid);
// console.log(tokens.token)
// console.log(date);
// console.log(date >= tokens.exp);

 // JavaScript program to check if the string
      // contains uppercase, lowercase
      // special character & numeric value
 
      function isAllPresent(str) {
        // Regex to check if a string
        // contains uppercase, lowercase
        // special character & numeric value
        var pattern = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
        );
 
        // If the string is empty
        // then print No
        if (!str || str.length === 0) {
          console.log("No" + "<br>");
          return;
        }
 
        // Print Yes If the string matches
        // with the Regex
       console.log(pattern.test(str))
        return;
      }
 
      // Driver Code
      var str = "#GeeksForGeeks123@";
      isAllPresent(str);