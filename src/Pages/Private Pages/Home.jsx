import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../Toolkit/Slices/AuthSlice.js";
import { fetchProducts } from "../../Toolkit/Slices/ProductSlice.js";

const Home = () => {
    const dispatch = useDispatch();


    const {
        products,
        loading: prodLoading,
        error: prodError,
    } = useSelector((s) => s.products);

    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const loading =  prodLoading;
    const error =  prodError;

    const closeModal = () => setSelectedProduct(null);
    useEffect(() => {
        const handleEsc = (e) => e.key === "Escape" && closeModal();
        if (selectedProduct) document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [selectedProduct]);

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
                                    key={product.id || product.name}
                                    onClick={() => setSelectedProduct(product)}
                                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 mb-4 flex items-center justify-center overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-400">No Image</span>
                                        )}
                                    </div>

                                    {/* Info */}
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

            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                        >
                            X
                        </button>

                        <div className="mb-6">
                            {selectedProduct.image ? (
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-64 object-cover rounded-xl"
                                />
                            ) : (
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                                    <span className="text-gray-500 text-xl">No Image Available</span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {selectedProduct.name}
                        </h2>
                        <p className="text-2xl font-bold text-blue-600 mb-4">
                            ${selectedProduct.price}
                        </p>

                        {selectedProduct.specs && (
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <h3 className="font-semibold text-gray-700 mb-2">Specifications</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {selectedProduct.specs}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;