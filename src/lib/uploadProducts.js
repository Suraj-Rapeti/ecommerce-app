import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { products } from "./products";

export const uploadProducts = async () => {
  try {
    for (let product of products) {
      const { id, ...productData } = product; // remove id

      await addDoc(collection(db, "products"), productData);
    }

    console.log("All products uploaded successfully!");
  } catch (error) {
    console.error("Error uploading products:", error);
  }
};