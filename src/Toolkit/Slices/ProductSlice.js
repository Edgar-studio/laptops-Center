import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";
import { notify } from "../../Components/UI/notify.jsx";

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

export const registerProduct = createAsyncThunk(
    "products/registerProduct",
    async ({ newProdName, price, category, specs, images = [] }, { rejectWithValue }) => {
        try {
            const response = await api.post("/products", {
                name: newProdName,
                price,
                specs: specs || null,
                images,
                category,
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

export const hardDeleteProduct = createAsyncThunk(
    "products/hardDeleteProduct",
    async (productId, { rejectWithValue }) => {
        try {
            await api.delete(`/products/${productId}`);
            return productId;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

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

export const editProduct = createAsyncThunk("products/editProduct",
    async (id, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/products/${id}`, { isEdited: false });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.message)
    }
}
)

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
            })

            .addCase(editProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.map(product =>
                    product.id === action.payload.id ? { ...product, ...action.payload } : product
                );
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(hardDeleteProduct.fulfilled, (state, action) => {
                 state.deletedProducts = state.deletedProducts.filter(
                 (product) => product.id !== action.payload
            );
        });
    }

});

export default productsSlice.reducer;