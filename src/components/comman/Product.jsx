import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";

function Product({ product, deleteProduct, onEdit }) {
  return (
    <Card sx={{ maxWidth: 345, margin: "auto" }}>
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.productName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          size="large"
          color="inherit"
          onClick={() => onEdit(product)}
        >
          <Edit />
        </IconButton>
        <IconButton
          size="large"
          color="inherit"
          aria-label="Delete"
          onClick={() => deleteProduct(product.id)}
        >
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default Product;
