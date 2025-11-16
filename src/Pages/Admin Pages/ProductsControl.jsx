import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
    fetchProducts,
    deleteProduct,
    returnProduct,
    registerProduct,
    updateProduct,
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
    const maxNumber = 10;

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

        console.log('🚀 Starting product registration...');
        console.log('Form data:', { newProdName, price, specs });
        console.log('Images count:', images.length);

        if (!newProdName || !price || images.length === 0) {
            notify("Please fill all fields and upload at least one image", "red");
            return;
        }

        setUploading(true);
        let registeredProductId = null;

        try {
            // ====== ШАГ 1: Ստեղծել ապրանքը առանց նկարների ======
            console.log('📝 Step 1: Creating product without images...');
            const registerResult = await dispatch(
                registerProduct({
                    newProdName,
                    price: Number(price),
                    specs: specs || null,
                    images: [], // Ժամանակավոր դատարկ
                })
            ).unwrap();

            registeredProductId = registerResult.id;
            console.log('✅ Product created with ID:', registeredProductId);

            // ====== ШАГ 2: Վերբեռնել նկարները ======
            console.log('📤 Step 2: Uploading images...');
            const formData = new FormData();

            images.forEach((image, index) => {
                if (image.file) {
                    formData.append("images", image.file);
                    console.log(`Adding image ${index + 1}:`, image.file.name);
                }
            });

            formData.append("productId", registeredProductId);

            const uploadResponse = await fetch("http://localhost:4000/api/upload-images", {
                method: "POST",
                body: formData,
            });

            console.log('Upload response status:', uploadResponse.status);

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                console.error('❌ Upload failed:', errorData);
                throw new Error(errorData.error || "Image upload failed");
            }

            const uploadData = await uploadResponse.json();
            console.log('✅ Images uploaded:', uploadData.images);

            // ====== ШАГ 3: Թարմացնել ապրանքը նկարներով ======
            console.log('🔄 Step 3: Updating product with images...');
            await dispatch(
                updateProduct({
                    id: registeredProductId,
                    data: {
                        images: uploadData.images,
                    }
                })
            ).unwrap();

            console.log('✅ Product updated successfully!');
            notify("Product registered with images!", "green");

            // Reset form
            reset();
            setImages([]);
            setShowForm(false);

            // Reload products
            dispatch(fetchProducts());

        } catch (err) {
            console.error("❌ Product registration failed:", err);
            notify(err.message || "Failed to register product", "red");

            // Rollback: ջնջել ապրանքը, եթե ստեղծվել է
            if (registeredProductId) {
                console.log('🔄 Rolling back - deleting product:', registeredProductId);
                try {
                    await dispatch(deleteProduct(registeredProductId)).unwrap();
                    console.log('✅ Product deleted (rollback)');
                } catch (deleteErr) {
                    console.error('❌ Rollback failed:', deleteErr);
                }
            }
        } finally {
            setUploading(false);
        }
    };

    const onImageChange = (imageList) => {
        console.log('📸 Images changed:', imageList.length);
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
                        <div className="col-span-2 space-y-4">
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
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Registered Products ({products.length})
                </h2>
                {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No products registered yet</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
                            >
                                {product.images && product.images.length > 0 && (
                                    <img
                                        src={`http://localhost:4000${product.images[0]}`}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-md mb-4 bg-gray-200"
                                        onError={(e) => {
                                            e.target.onerror = null; // Կանխել loop-ը
                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                )}
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 mb-2">Price: ${product.price}</p>
                                {product.specs && (
                                    <p className="text-sm text-gray-500 mb-4">Specs: {product.specs}</p>
                                )}
                                {product.images && product.images.length > 1 && (
                                    <p className="text-xs text-gray-400 mb-4">
                                        +{product.images.length - 1} more images
                                    </p>
                                )}
                                <button
                                    onClick={() => handleDelete(product)}
                                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Deleted Products */}
            {deletedProducts.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        Deleted Products ({deletedProducts.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deletedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300 opacity-75"
                            >
                                {product.images && product.images.length > 0 && (
                                    <img
                                        src={`http://localhost:4000${product.images[0]}`}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-md mb-4"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                        }}
                                    />
                                )}
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 mb-2">Price: ${product.price}</p>
                                <button
                                    onClick={() => handleReturn(product)}
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                >
                                    <FaUndo /> Restore
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsControl;