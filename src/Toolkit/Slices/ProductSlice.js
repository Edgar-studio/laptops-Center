import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";
import { notify } from "../../Components/UI/notify.jsx";

// Fetch all products
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/products");
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Register new product (with images array)
export const registerProduct = createAsyncThunk(
    "products/registerProduct",
    async ({ newProdName, price, specs, images = [] }, { rejectWithValue }) => {
        try {
            const response = await api.post("/products", {
                name: newProdName,
                price,
                specs: specs || null,
                images,
                isDeleted: false,
            });
            notify("Product registered successfully", "green");
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Registration failed";
            notify(message, "red");
            return rejectWithValue(message);
        }
    }
);

// Soft delete product
export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await api.patch(`/products/${id}`, { isDeleted: true });
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Restore deleted product
export const returnProduct = createAsyncThunk(
    "products/returnProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/products/${id}`, { isDeleted: false });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ProductSlice.js-ում ավելացրու
export const updateProduct = createAsyncThunk("products/updateProduct",
    async ({id, data}, {rejectWithValue}) => {
        try {
            const response = await api.patch(`/products/${id}`, data);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

    // extraReducers-ում ավելացրու


const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        deletedProducts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // === FETCH PRODUCTS ===
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                const all = action.payload || [];
                state.products = all.filter((p) => !p.isDeleted);
                state.deletedProducts = all.filter((p) => p.isDeleted);
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // === REGISTER PRODUCT ===
            .addCase(registerProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerProduct.fulfilled, (state, action) => {
                state.loading = false;
                const newProduct = action.payload;
                newProduct.images = newProduct.images || [];
                state.products.push(newProduct);
            })
            .addCase(registerProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.products = state.products.map(product =>
                    product.id === action.payload.id ? action.payload : product
                );
            })

            // === DELETE PRODUCT ===
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.payload;
                const index = state.products.findIndex((p) => p.id === id);
                if (index !== -1) {
                    const [deleted] = state.products.splice(index, 1);
                    deleted.isDeleted = true;
                    state.deletedProducts.push(deleted);
                }
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // === RETURN PRODUCT ===
            .addCase(returnProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(returnProduct.fulfilled, (state, action) => {
                state.loading = false;
                const product = action.payload;
                const index = state.deletedProducts.findIndex((p) => p.id === product.id);
                if (index !== -1) {
                    state.deletedProducts.splice(index, 1);
                    product.isDeleted = false;
                    product.images = product.images || [];
                    state.products.push(product);
                }
            })
            .addCase(returnProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productsSlice.reducer;