//configuration file enviroement with firebase
import { readFileSync } from "fs";
import admin from 'firebase-admin';
// requesting file "credentials.json". that contains firebase credentials. customize them.
const creds = JSON.parse(readFileSync(new URL('./credentials.json', import.meta.url)));

admin.initializeApp({
    credential:admin.credential.cert(creds.data),
    databaseURL: creds.dburl
});
const db = admin.database();
// requirements of path, data info and child generated
export const saveData = (path, data, child)=>{
    const ref = db.ref(path);
    return ref.child(child).set(data);
};
//check if a book is already there
export const checkBookExistence = async (path, child) => {
    const ref = db.ref(path);
    const snapshot = await ref.child(child).once('value');
    return snapshot.exists(); 
};
export const uniqueID = async(path) =>{
    const ref = db.ref(path).push();
    return ref.key;
};