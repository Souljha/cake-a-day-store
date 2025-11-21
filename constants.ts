
import { MenuCategory } from './types';

export const PHONE_NUMBER = "+27 73 599 9972";
export const ADDRESS = "55 Strathlyn Avenue, Seaview, Durban, 4094";

export const MENU_DATA: MenuCategory[] = [
    {
        title: "Signature Cakes",
        items: [
            { name: "White Christmas Cake", price: "R500", imageUrl: "/Christmas_01.jpg" },
            { name: "Father Christmas falling Cake", price: "R450", imageUrl: "/Christmas_02.jpg" },
            { name: "Upside down Cake", price: "R550", imageUrl: "/Christmas_03.jpg" },
            { name: "Christmas Red Cake", price: "R380", imageUrl: "/Christmas_04.jpg" },
            { name: "Christmas tree Cake", price: "R500", imageUrl: "/Christmas_05.jpg" },
            { name: "Ice Cream Cake", price: "R500", imageUrl: "/Biscuit Cake.jpg" },
            { name: "Christmas Slice Cakes", price: "R60", imageUrl: "/Christmas cake tree_01.jpg" },
            { name: "Custom Christmas Cakes", price: "R450", imageUrl: "/christmas deco.jpg" },
            { name: "Halloween Cakes", price: "R400", imageUrl: "/Halloween.jpg" },
        ]
    },
    {
        title: "Cupcakes",
        items: [
            { name: "Christmas Cupcakes", price: "R90/doz", imageUrl: "/Christmas cupcakes.jpg" },
            { name: "Raspberry Compote", price: "R120/doz", imageUrl: "/Raspberry cupcakes.jpeg" },
            { name: "Chocolate Cake / Cupcakes", price: "R350", imageUrl: "/Chocolate cupcakes.jpg" },
            { name: "Strawberry Compote", price: "R120/doz", imageUrl: "/Strawberry cupcakes.jpeg" },
            { name: "Blueberry Cupcakes", price: "R90/doz", imageUrl: "/blueberry-cupcakes.jpg" },
            { name: "Mixed Cupcakes", price: "R90/doz", imageUrl: "/mixed cupcakes.jpg" },
        ]
    },
    {
        title: "Tarts & Pies",
        items: [
            { name: "DIY cookie decorating kit", price: "R60", imageUrl: "/Biscuit cut outs.jpg" },
            { name: "Mini Caramel Tart", price: "R120/doz", imageUrl: "/Mini caramel tarts.jpeg" },
            { name: "Cake pops 10 for:", price: "R120", imageUrl: "/Stick Sweet.jpg" },
            { name: "Banana Cream Pie", price: "R120/large", imageUrl: "/Banana cream pie.jpeg" },
            { name: "Mini Lemon Meringue Tart", price: "R120/doz", imageUrl: "/Lemon meringue tarts.jpeg" },
            { name: "Medovik", price: "R250", imageUrl: "/Honey pie.jpeg" },
        ]
    },
    {
        title: "Sweet Treats",
        items: [
            { name: "Baklava", price: "R360/doz", imageUrl: "/Baklava pieces.jpeg" },
            { name: "Koeksisters", price: "R120/doz", imageUrl: "/Koeksisters.JPG" },
            { name: "Cakesicles", price: "R120/doz", imageUrl: "/Cakesicles.jpeg" },
            { name: "Lamingtons", price: "R90/doz", imageUrl: "/Lamingtons.JPG" },
            { name: "Peppermint Tart", price: "R120", imageUrl: "/Tiramisu.jpeg" },
            { name: "Churros", price: "R90/doz", imageUrl: "/Churros.jpeg" },
        ]
    },
    {
        title: "Scones & Muffins",
        items: [
            { name: "Brownies", price: "120/doz", imageUrl: "/brownies.jpg" },
            { name: "Chocolate Muffins", price: "R120/doz", imageUrl: "/Chocolate muffins.JPG" },
            { name: "Blueberry Muffins", price: "R120/doz", imageUrl: "/Blueberry muffins.JPG" },
            { name: "Burger Scones", price: "R120/doz", imageUrl: "/Burger scones.jpeg" },
            { name: "Biscuits", price: "R100", imageUrl: "/Biscuits.JPG" },
            { name: "Donuts", price: "R90/doz", imageUrl: "/Donuts.jpg" },
        ]
    }
];