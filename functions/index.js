const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
admin.initializeApp(functions.config().firebase);

const { auth, database } = admin;

exports.deleteUserFromAuthentications = functions.https.onRequest((request, res) => {
    const { userId } = request.body;
    console.log(userId)
    auth().deleteUser(userId)
        .then(() => {
            deleteUserFromDB(userId, res);
            return;
        })
        .catch((error) => {
            console.log(error, " error in delete user from authentication");
            throw new Error('AUTH_DELETE_FAILED');
        });
});

const deleteUserFromDB = (docId, res) => {
    database().ref("users").child(docId).remove()
    database().ref("allHallData").child(docId).remove()
        .then(() => res.send("SUCCESS"))
        .catch((error) => {
            console.log(error, " error in delete user from database");
            throw new Error('DATABASE_DELETE_FAILED');
        });
}

exports.changePasswordFromAuthentications = functions.https.onRequest((request, res) => {
    const { userId, newPassword } = request.body;
    console.log(userId, " user id");
    console.log(newPassword, " password");
    auth().updateUser(userId, {
        password: newPassword,
    })
        .then(() => updatePassword(userId, newPassword, res))
        .catch((error) => {
            console.log(error, " error in delete user from authentication");
            throw new Error('AUTH_UPDATE_PASSWORD_FAILED');
        });
});

const updatePassword = (docId, password, res) => {
    database().ref("users").child(docId).update({
        password,
        confirmPassword: password,
    }).then(() => res.send("SUCCESS")).catch((error) => {
        console.log(error, " error in update user password from database");
        throw new Error('FIREBASE_UPDATE_PASSWORD_FAILED');
    });
}