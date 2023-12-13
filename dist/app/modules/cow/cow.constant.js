"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cowFilterableFields = exports.cowSearchableFields = exports.bloodGroup = exports.gender = exports.category = exports.label = exports.breed = exports.location = void 0;
exports.location = [
    'Dhaka',
    'Chattogram',
    'Barishal',
    'Rajshahi',
    'Sylhet',
    'Comilla',
    'Rangpur',
    'Mymensingh',
];
exports.breed = [
    'Brahman',
    'Nellore',
    'Sahiwal',
    'Gir',
    'Indigenous',
    'Tharparkar',
    'Kankrej',
];
exports.label = ['for sale', 'sold out'];
exports.category = ['Dairy', 'Beef', 'Dual Purpose'];
exports.gender = ['male', 'female'];
exports.bloodGroup = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
exports.cowSearchableFields = ['location', 'breed', 'category'];
exports.cowFilterableFields = [
    'searchTerm',
    'location',
    'name',
    'age',
    'price',
    'location',
    'weight',
    'breed',
    'category',
];
