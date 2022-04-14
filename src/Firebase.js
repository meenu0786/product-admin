import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore,doc,setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClFRFsj7SiBP0nFVDafXXX1wervOpDDUg",
  authDomain: "admin-project-4bb4d.firebaseapp.com",
  projectId: "admin-project-4bb4d",
  storageBucket: "admin-project-4bb4d.appspot.com",
  messagingSenderId: "366605511101",
  appId: "1:366605511101:web:b7be9e419135947e5a0ad4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password,toast) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err.code);
    toast.error(err.code);
  }
};

const registerWithEmailAndPassword = async (data,toast) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = res.user;
    await setDoc(doc(db, "users",user.uid), {
      uid: user.uid,
      name:data.name,
      authProvider: "local",
      email:data.email,
    });
  } catch (err) {
    console.error(err);
    toast.error(err.code);
  }
};

const logout = () => {
  signOut(auth);
};

const storage =  getStorage(app);

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  storage
};
