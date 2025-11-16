import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
    fetchProducts,
    deleteProduct,
    returnProduct,
    registerProduct,
} from "../../Toolkit/Slices/ProductSlice.js";
import { FaTrash, FaUndo, FaPlus, FaMinus } from "react-icons/fa";
import { notify } from "../../Components/UI/notify.jsx";
import { useForm } from "react-hook-form";
import {
    productNameValidation,
    productPriceValidation,
    productSpecsValidation,
} from "../../Utils/Validations.js";
import InputNewProd from "../../Components/UI/InputNewProd.jsx";
import ImageUploading from "react-images-uploading";

const ProductsControl = () => {
    const [images, setImages] = useState([]);
    const maxNumber = 10; // առավելագույն 10 նկար

    const dispatch = useDispatch();
    const { products, deletedProducts, loading, error } = useSelector(
        (state) => state.products
    );

    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (product) => {
        if (window.confirm(`Delete "${product.name}"?`)) {
            dispatch(deleteProduct(product.id));
        }
    };

    const handleReturn = (product) => {
        dispatch(returnProduct(product.id));
        notify("Product returned successfully", "green");
    };

    const handleAddProduct = async (data) => {
        const { newProdName, price, specs } = data;

        if (!newProdName || !price || images.length === 0) {
            notify("Please fill all fields and upload at least one image", "red");
            return;
        }

        setUploading(true);

        try {
            // 1. Ստեղծել ապրանքը (ստանալ ID)
            const registerResult = await dispatch(
                registerProduct({
                    newProdName,
                    price: Number(price),
                    specs: specs || null,
                    images: [], // ժամանակավորապես դատարկ
                })
            ).unwrap();

            const productId = registerResult.id;

            // 2. Վերբեռնել նկարները
            const formData = new FormData();
            images.forEach((image) => {
                if (image.file) {
                    formData.append("images", image.file);
                }
            });
            formData.append("productId", productId);

            const uploadResponse = await fetch("http://localhost:4000/api/upload-images", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) throw new Error("Image upload failed");

            const uploadData = await uploadResponse.json();

            // 3. Թարմացնել ապրանքը նկարների URL-ներով
            await dispatch(
                registerProduct({
                    id: productId,
                    newProdName,
                    price: Number(price),
                    specs: specs || null,
                    images: uploadData.images,
                })
            ).unwrap();

            notify("Product registered with images!", "green");
            reset();
            setImages([]);
            setShowForm(false);
            dispatch(fetchProducts());

        } catch (err) {
            console.error("Product registration failed:", err);
            notify("Failed to register product", "red");
        } finally {
            setUploading(false);
        }
    };

    const onImageChange = (imageList) => {
        setImages(imageList);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                Products Dashboard
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            {(loading || uploading) && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">
                        {uploading ? "Uploading images..." : "Loading..."}
                    </span>
                </div>
            )}

            {/* Add Product Button */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
                >
                    {showForm ? (
                        <>
                            <FaMinus /> Cancel
                        </>
                    ) : (
                        <>
                            <FaPlus /> Add Product
                        </>
                    )}
                </button>
            </div>

            {/* Add Product Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit(handleAddProduct)}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8"
                >
                    <h3 className="text-xl font-semibold mb-4">Register New Product</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Image Uploader */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Images *
                            </label>
                            <ImageUploading
                                multiple
                                value={images}
                                onChange={onImageChange}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                                acceptType={["jpg", "png", "jpeg", "webp"]}
                            >
                                {({
                                      imageList,
                                      onImageUpload,
                                      onImageRemoveAll,
                                      onImageUpdate,
                                      onImageRemove,
                                      isDragging,
                                      dragProps,
                                  }) => (
                                    <div className="border-2 border-dashed rounded-xl p-4 text-center">
                                        <button
                                            type="button"
                                            className={`w-full py-8 text-sm font-medium transition ${
                                                isDragging ? "text-red-600" : "text-blue-600"
                                            }`}
                                            onClick={onImageUpload}
                                            {...dragProps}
                                        >
                                            Click or Drop Images Here
                                        </button>

                                        {imageList.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={onImageRemoveAll}
                                                className="mt-2 text-xs text-red-600 underline"
                                            >
                                                Remove all
                                            </button>
                                        )}

                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            {imageList.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group border rounded-lg overflow-hidden"
                                                >
                                                    <img
                                                        src={image.data_url}
                                                        alt={`upload ${index + 1}`}
                                                        className="w-full h-24 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => onImageUpdate(index)}
                                                            className="text-white text-xs px-2 py-1 bg-blue-600 rounded"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => onImageRemove(index)}
                                                            className="text-white text-xs px-2 py-1 bg-red-600 rounded"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </ImageUploading>
                            {images.length === 0 && (
                                <p className="text-red-500 text-xs mt-1">At least one image is required</p>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <InputNewProd
                                type="text"
                                placeholder="Product Name *"
                                register={register}
                                name="newProdName"
                                validation={productNameValidation}
                                error={errors.newProdName?.message}
                            />

                            <InputNewProd
                                type="text"
                                placeholder="Price *"
                                register={register}
                                name="price"
                                validation={productPriceValidation}
                                error={errors.price?.message}
                            />

                            <InputNewProd
                                type="text"
                                placeholder="Specs (optional)"
                                register={register}
                                name="specs"
                                validation={productSpecsValidation}
                                error={errors.specs?.message}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || uploading || images.length === 0}
                        className={`mt-6 w-full py-3 rounded-lg font-medium transition ${
                            !isValid || uploading || images.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                    >
                        {uploading ? "Registering..." : "Register Product"}
                    </button>
                </form>
            )}

            {/* Registered Products */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Registered Products ({products.length})
                </h2>
                {products.length === 0 && !loading ? (
                    <p className="text-gray-500 italic text-center py-8 bg-white rounded-xl shadow">
                        No products registered yet.
                    </p>
                ) : (
                    <div className="grid gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex gap-4"
                            >
                                {/* Product Images */}
                                {product.images && product.images.length > 0 && (
                                    <div className="flex gap-1 flex-shrink-0">
                                        {product.images.slice(0, 3).map((src, i) => (
                                            <img
                                                key={i}
                                                src={src}
                                                alt={`${product.name} ${i + 1}`}
                                                className="w-16 h-16 object-cover rounded border shadow-sm"
                                            />
                                        ))}
                                        {product.images.length > 3 && (
                                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                                                +{product.images.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Product Info */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600">Price: ${product.price}</p>
                                    {product.specs && (
                                        <p className="text-gray-500 text-sm mt-1">
                                            Specs: {product.specs}
                                        </p>
                                    )}
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(product)}
                                    className="text-red-600 hover:text-red-800 text-xl transition self-center"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Deleted Products */}
            {deletedProducts.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Deleted Products ({deletedProducts.length})
                    </h2>
                    <div className="grid gap-4">
                        {deletedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white p-5 rounded-xl shadow-sm border border-red-200 opacity-75 flex gap-4 items-center"
                            >
                                {product.images && product.images.length > 0 && (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded border"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-600 line-through">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500">Price: ${product.price}</p>
                                    {product.specs && (
                                        <p className="text-gray-400 text-sm mt-1">
                                            Specs: {product.specs}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleReturn(product)}
                                    className="text-green-600 hover:text-green-800 text-xl transition"
                                    title="Restore"
                                >
                                    <FaUndo />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductsControl;