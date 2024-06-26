const jwt = require("jsonwebtoken");
const { Listings } = require("../models/Listing");
const CartItem = require("../models/CartItem");
const Order = require("../models/Order");

const authUser = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      if (decoded.role === "user") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "unauthorized" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "missing token" });
  }
};

const authMerchant = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      if (decoded.role === "merchant") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "unauthorized" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "missing token" });
  }
};

const authCartOwner = async (req, res, next) => {
  if (req.body.id) {
    const cart = await CartItem.findById(req.body.id);

    if (cart) {
      if (cart.user.toString() !== req.decoded.id) {
        return res.status(403).json({ status: "error", msg: "unauthorized" });
      }
    } else {
      return res.status(404).json({ status: "error", msg: "not found" });
    }
  }
  next();
};

const authListingOwner = async (req, res, next) => {
  if (req.body.id) {
    const listing = await Listings.findById(req.body.id);

    if (listing) {
      if (listing.merchant.toString() !== req.decoded.id) {
        return res.status(403).json({ status: "error", msg: "unauthorized" });
      }
    } else {
      return res.status(404).json({ status: "error", msg: "not found" });
    }
  }

  if (req.body.merchant) {
    if (req.body.merchant !== req.decoded.id) {
      return res.status(403).json({ status: "error", msg: "unauthorized" });
    }
  }
  next();
};

const authMerchantOrderOwner = async (req, res, next) => {
  if (req.body.id) {
    const order = await Order.findById(req.body.id);

    if (order) {
      if (order.merchant.toString() !== req.decoded.id) {
        return res.status(403).json({ status: "error", msg: "unauthorized" });
      }
    } else {
      return res.status(404).json({ status: "error", msg: "not found" });
    }
  }

  if (req.body.merchant) {
    if (req.body.merchant !== req.decoded.id) {
      return res.status(403).json({ status: "error", msg: "unauthorized" });
    }
  }
  next();
};

const authUserOrderOwner = async (req, res, next) => {
  if (req.body.user) {
    if (req.body.user !== req.decoded.id) {
      return res.status(403).json({ status: "error", msg: "unauthorized" });
    }
  }
  next();
};

module.exports = {
  authUser,
  authMerchant,
  authCartOwner,
  authListingOwner,
  authMerchantOrderOwner,
  authUserOrderOwner,
};
