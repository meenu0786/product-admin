import {  Fab, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { collection, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import AddProductDialog from "./comman/AddProductDialog";
import { auth, db } from "../Firebase";
import AppTopBar from "./comman/AppTopBar";
import Product from "./comman/Product";
import EditProductDialog from "./comman/EditProductDialog";

export default function Dashboard({ toast }) {
  const [addDialog, setAddDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [user] = useAuthState(auth);

  useEffect(() => {
    setFilteredProduct(products);
    setSearchInput("");
  }, [products]);

  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [user]);

  const getProducts = async () => {
    const unsub = onSnapshot(
      collection(db, `users/${user.uid}/products`),
      (doc) => {
        let productsArr = [];
        doc.forEach((value) => {
          productsArr.push({ id: value.id, ...value.data() });
        });
        setProducts(productsArr);
      }
    );
    return unsub;
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, `users/${user.uid}/products/${id}`));
  };

  const onEdit = (product) => {
    setSelectedProduct(product);
    setEditDialog(true);
  };

  const searchFilter = (e) => {
    const value = products.filter((value) =>
      value.productName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchInput(e.target.value);
    setFilteredProduct(value);
  };

  const handleClose = () => {
    setAddDialog(false);
  };

  const closeEditDialog = () => {
    setSelectedProduct(null);
    setEditDialog(false);
  };

  return (
    <div className="main-container">
      <AppTopBar />
      <div className="autocomplete">
        <TextField
          className="search"
          onChange={searchFilter}
          label="Search Product"
          value={searchInput}
        />
      </div>

      {products.length > 0 ? (
        <Grid
          container
          marginTop={"0px"}
          marginBottom={"10px"}
          alignItems="center"
          spacing={5}
        >
          {filteredProduct.map((value) => (
            <Grid item xs={12} md={3}>
              <Product
                product={value}
                onEdit={onEdit}
                deleteProduct={deleteProduct}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className="empty-div">
          <h3>No Product Available</h3>
        </div>
      )}
      <Fab
        style={{
          margin: 0,
          top: "auto",
          right: 25,
          bottom: 25,
          left: "auto",
          position: "fixed",
        }}
        color="primary"
        aria-label="add"
        onClick={() => setAddDialog(true)}
      >
        <AddIcon />
      </Fab>
      <AddProductDialog
        toast={toast}
        open={addDialog}
        handleClose={handleClose}
      />

      {selectedProduct ? (
        <EditProductDialog
          toast={toast}
          open={editDialog}
          handleClose={closeEditDialog}
          product={selectedProduct}
        />
      ) : null}
    </div>
  );
}
