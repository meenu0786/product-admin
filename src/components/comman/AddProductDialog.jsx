import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { storage, db, auth } from "../../Firebase";
import '../../App.css'

const initialProduct = {
  productName: "",
  image: null,
  description: "",
};

export default function AddProductDialog({ open, handleClose, toast }) {
  const [productData, setProductData] = useState(initialProduct);
  const [imageUrl, setImageUrl] = useState();
  const [user] = useAuthState(auth);

  const handleFireBaseUpload = (e) => {
    const imageAsFile = e.target.files[0];

    const storageRef = ref(storage, `/images/${imageAsFile.name}`);

    uploadBytes(storageRef, imageAsFile)
      .then((snapShot) => {
        console.log(snapShot);
        getDownloadURL(storageRef).then((url) => {
          setImageUrl(url);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onTextChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const closeDialog = () => {
    setImageUrl(null);
    setProductData(initialProduct);
    handleClose();
  };

  const handleSubmit = async () => {
    if (productData.productName == "") {
      toast.error("Enter Product Name");
    } else if (productData.description == "") {
      toast.error("Enter Product Description");
    } else if (!imageUrl) {
      toast.error("Select Image");
    } else {
      try {
        closeDialog();
        await addDoc(collection(db, `users/${user.uid}/products`), {
          ...productData,
          image: imageUrl,
          created: Timestamp.now(),
          userId: user.uid,
        });
     
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <Dialog fullWidth="400" open={open} onClose={closeDialog}>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Product Name"
          type="text"
          name="productName"
          value={productData.productName}
          onChange={onTextChange}
          fullWidth
          variant="standard"
        />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label="Description"
          type="text"
          name="description"
          value={productData.description}
          onChange={onTextChange}
          fullWidth
          variant="standard"
          multiline
        />

        {imageUrl ? (
          <div className="img-container">
            <img src={imageUrl} />
            <IconButton onClick={() => setImageUrl(null)} className="btn">
              <Delete />
            </IconButton>
          </div>
        ) : (
          <Button
            style={{ margin: "25px 0px 0px 0px" }}
            variant="contained"
            component="label"
          >
            Upload Image
            <input onChange={handleFireBaseUpload} type="file" hidden />
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Product</Button>
      </DialogActions>
    </Dialog>
  );
}
