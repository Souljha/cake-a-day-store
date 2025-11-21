import React from 'react';
import { PHONE_NUMBER, ADDRESS } from '../constants';

const Contact: React.FC = () => {
    return (
        <section className="py-20 bg-pink-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold text-gray-800">Get In Touch</h2>
                    <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
                        Ready to order or have a question? Contact us! We deliver across Durban.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">Contact & Delivery</h3>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-pink-100 p-3 rounded-full">
                                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-700">Order by Phone</h4>
                                    <a href={`tel:${PHONE_NUMBER}`} className="text-2xl text-pink-600 font-bold hover:underline">{PHONE_NUMBER}</a>
                                    <p className="text-gray-500">To ensure freshness, please order 5 days in advance.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-pink-100 p-3 rounded-full">
                                   <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-700">Cake a Day Online Store</h4>
                                    <p className="text-lg text-gray-600">Order online for delivery across Durban</p>
                                    <p className="text-gray-500">To ensure freshness, please order 5 days in advance.</p>
                                </div>
                            </div>
                        </div>
                        <a href={`tel:${PHONE_NUMBER}`} className="mt-8 block w-full text-center bg-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-pink-700 transition-all duration-300 hover:scale-105 shadow-md">
                            Call to Order Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;