const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.getAll = async (req, res) => {
    try {
      const users = await User.find({})
      return res.status(200).json(users)  
    } catch (error) {
      console.log('error to find data')
      console.error(error)
      return res.status(500).json({
          success:false,
          massage:"Error"
      })
    }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User does not exists");
    }

    const { password, ...others } = user._doc;

    return res.status(200).json(others);
  } catch (error) {
    console.error(error)
    return res.status(500).json({
        success:false,
        massage:"Error"
    })
  }
};

exports.updateUser = async (req, res) => {
  console.log(req.params.id)
  if (req.params.id === req.user.id) {
    try {
      if (req.body.password) {
        const newHashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = newHashedPassword;
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User does not exists");
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error)
      return res.status(500).json({
          success:false,
          massage:"Error"
      })
    }
  } else {
    return res.status(403).json({ msg: "You can update only your profile!" });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.params.id === req.body.userId) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User does not exists");
      }

      await User.findByIdAndDelete(req.params.id);

      return res.status(200).json({ msg: "Successfully deleted!" });
    } catch (error) {
      console.error(error)
      return res.status(500).json({
          success:false,
          massage:"Error"
      })
    }
  } else {
    return res.status(403).json({ msg: "You can delete only your profile!" });
  }
};

exports.getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User does not exists");
    }

    const userFriends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId).select("-password");
      })
    );

    if (userFriends.length > 0) {
      return res.status(200).json(userFriends);
    } else {
      throw new Error("You have no friends");
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
        success:false,
        massage:"Error"
    })
  }
};

exports.followUser = async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const friend = await User.findById(req.params.id);
      if (!friend) {
        throw new Error("User does not exists");
      }

      if (friend.followers.includes(req.body.userId)) {
        throw new Error("Can't follow the same user twice");
      }

      await User.findByIdAndUpdate(req.params.id, {
        $push: { followers: req.body.userId },
      });
      await User.findByIdAndUpdate(req.body.userId, {
        $push: { followings: req.params.id },
      });

      console.log("follow");
      return res.status(200).json({ msg: "User successfully followed" });
    } catch (error) {
      console.error(error)
      return res.status(500).json({
          success:false,
          massage:"Error"
      })
    }
  } else {
    return res.status(500).json("Can't follow yourself");
  }
};

exports.unfollowUser = async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const friend = await User.findById(req.params.id);
      if (!friend) {
        throw new Error("User does not exists");
      }

      if (!friend.followers.includes(req.body.userId)) {
        throw new Error(
          "Can't unfollow someone you don't follow in the first place"
        );
      }

      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.body.userId },
      });
      await User.findByIdAndUpdate(req.body.userId, {
        $pull: { followings: req.params.id },
      });
      
      return res.status(200).json({ msg: "User successfully unfollowed" });
    } catch (error) {
      console.error(error)
      return res.status(500).json({
          success:false,
          massage:"Error"
      })
    }
  } else {
    return res.status(500).json("Can't follow yourself");
  }
};

