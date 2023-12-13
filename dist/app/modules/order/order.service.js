"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cow_model_1 = require("../cow/cow.model");
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const order_model_1 = require("./order.model");
/* @typescript-eslint/no-unused-vars */
const createdOrder = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { cow: cowId, buyer: buyerId } = data;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const foundCow = yield cow_model_1.Cow.findById(cowId).populate('seller').exec();
        const foundBuyer = yield user_model_1.User.findById(buyerId);
        const Seller = yield user_model_1.User.findById(foundCow === null || foundCow === void 0 ? void 0 : foundCow.seller).exec();
        if (!foundCow || !foundBuyer) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cow or buyer not found');
        }
        if (foundBuyer.budget < foundCow.price) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Insufficient funds');
        }
        if (foundCow.label == 'for sale') {
            foundCow.label = 'sold out';
            yield foundCow.save({ session });
            foundBuyer.budget -= foundCow.price;
            yield foundBuyer.save({ session });
        }
        else {
            throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'This cow is already sold!');
        }
        if (Seller && (Seller === null || Seller === void 0 ? void 0 : Seller.income) !== undefined) {
            Seller.income = (Seller.income || 0) + foundCow.price;
            yield Seller.save({ session });
        }
        const createdOrder = yield order_model_1.Order.create(data);
        yield session.commitTransaction();
        yield session.endSession();
        return createdOrder;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getAllOrders = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
        const orders = yield order_model_1.Order.find()
            .populate({
            path: 'cow',
            populate: [
                {
                    path: 'seller',
                },
            ],
        })
            .populate('buyer')
            .exec();
        return orders;
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'buyer') {
        const buyerId = user === null || user === void 0 ? void 0 : user.userId;
        const orders = yield order_model_1.Order.find({ buyer: buyerId });
        return orders;
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'seller') {
        const id = user === null || user === void 0 ? void 0 : user.userId;
        const sellerCow = yield cow_model_1.Cow.find({ seller: id }).select({ _id: 1 });
        const cowsId = sellerCow.map(cow => cow._id);
        const result = yield order_model_1.Order.find({ cow: { $in: cowsId } })
            .populate({
            path: 'cow',
            populate: [
                {
                    path: 'seller',
                },
            ],
        })
            .populate('buyer');
        return result;
    }
});
const getSpecificOrder = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = id;
    const userId = user === null || user === void 0 ? void 0 : user.userId;
    if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
        const orders = yield order_model_1.Order.find()
            .populate({
            path: 'cow',
            populate: [
                {
                    path: 'seller',
                },
            ],
        })
            .populate('buyer')
            .exec();
        return orders;
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'buyer') {
        const order = order_model_1.Order.find({ $and: [{ _id: orderId }, { buyer: userId }] })
            .populate('cow')
            .populate('buyer');
        if (!order) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Order not found!');
        }
        return order;
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'seller') {
        const sellerCow = yield cow_model_1.Cow.find({ seller: userId }).select({ _id: 1 });
        const cowsId = sellerCow.map(cow => cow._id);
        const order = order_model_1.Order.find({ $and: [{ _id: orderId }, { cow: cowsId }] })
            .populate('cow')
            .populate('buyer');
        if (!order) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Order not found!');
        }
        return order;
    }
});
exports.orderService = {
    createdOrder,
    getAllOrders,
    getSpecificOrder,
};
