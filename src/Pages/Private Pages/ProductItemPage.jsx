import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductItemPage = () => {
    const { id } = useParams();
    const { products } = useSelector(state => state.products);

    const product = products.find(p => p.id === id);

    if (!product) {
        return (
            <div className="p-10 text-center text-gray-500 text-xl">
                Product not found...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                {product.images?.length ? (
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination
                        slidesPerView={1}
                    >
                        {product.images.map((img, i) => (
                            <SwiperSlide key={i}>
                                <img
                                    src={img}
                                    alt={product.name}
                                    className="w-full rounded-xl object-cover"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="bg-gray-200 w-full h-64 flex items-center justify-center rounded-xl">
                        <span className="text-gray-500">No Image</span>
                    </div>
                )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-blue-600 font-semibold mb-4">
                ${product.price}
            </p>

            {product.specs && (
                <div className="bg-gray-50 p-4 rounded-xl">
                    <h2 className="font-semibold text-gray-700 mb-2">Specifications</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{product.specs}</p>
                </div>
            )}
        </div>
    );
};

export default ProductItemPage;
