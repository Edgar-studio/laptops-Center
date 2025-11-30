import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../Toolkit/Slices/ProductSlice.js";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        products,
        loading: prodLoading,
        error: prodError,
    } = useSelector((s) => s.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">

                <section>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Registered Products ({products.length})
                    </h2>

                    {products.length === 0 && !prodLoading ? (
                        <p className="text-gray-500 italic">No products registered yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/products/${product.id}`)}
                                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-200
                                    hover:shadow-lg transition cursor-pointer"
                                >
                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl
                                    w-full h-40 mb-4 flex items-center justify-center overflow-hidden">
                                        {product.images?.length > 0 ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-400">No Image</span>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-xl font-bold text-blue-600">
                                        ${product.price}
                                    </p>
                                    {product.specs && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {product.specs}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Products;
