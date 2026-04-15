import dotenv from 'dotenv';
dotenv.config();

export const users = {
    standard: {
        username: process.env.STANDARD_USER || 'standard_user',
        password: process.env.PASSWORD || 'secret_sauce',
    },
    locked: {
        username: process.env.LOCKED_USER || 'locked_out_user',
        password: process.env.PASSWORD || 'secret_sauce',
    },
    problem: {
        username: process.env.PROBLEM_USER || 'problem_user',
        password: process.env.PASSWORD || 'secret_sauce',
    },
    performance: {
        username: process.env.PERFORMANCE_USER || 'performance_glitch_user',
        password: process.env.PASSWORD || 'secret_sauce',
    },
    invalid: {
        username: 'invalid_user',
        password: 'wrong_password',
    },
};

export const sortOptions = {
    AtoZ: 'az',
    ZtoA: 'za',
    LowToHigh: 'lohi',
    HighToLow: 'hilo',
};

export const expectedErrors = {
    lockedUser: 'Epic sadface: Sorry, this user has been locked out.',
    invalidUser: 'Epic sadface: Username and password do not match any user in this service',
    emptyUser: 'Epic sadface: Username is required',
    emptyPass: 'Epic sadface: Password is required',
};

export const products = {
    backpack: 'Sauce Labs Backpack',
    bikeLight: 'Sauce Labs Bike Light',
    boltShirt: 'Sauce Labs Bolt T-Shirt',
    fleeceJacket: 'Sauce Labs Fleece Jacket',
    onesie: 'Sauce Labs Onesie',
    redShirt: 'Test.allTheThings() T-Shirt (Red)',
};

export const productPrices = {
    backpack: 29.99,
    bikeLight: 9.99,
    boltShirt: 15.99,
    fleeceJacket: 49.99,
    onesie: 7.99,
    redShirt: 15.99,
};