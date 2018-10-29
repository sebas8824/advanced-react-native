const admin = require('firebase-admin');

module.exports = (request, response) => {
    // Verify the user provided a Phone
    if (!request.body.phone) {
        response.status(422).send({ error: 'Bad input' });
    }
    
    // Format the phone number, to remove dashes and parens
    const phone = String(request.body.phone)
    // TODO: Build a function to treat the phone input and control its http response.
        .replace(/(?:\+\d+)?(?:\s+)(?:(\d+)-)?(\d+)/, "$1$2")
        .replace(/[^\d]/g, "");
    
    // Create a new user account using that phone number
    admin.auth().createUser({ uid: phone })
        .then(user => response.send(user))
        .catch(err => response.status(422).send({ error: err }));
    
    // Respond to the user request, saying the account was made.  
}