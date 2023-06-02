const Comment = require("../models/Comment");


exports.getCommentsFromPost = async(req, res) => {
    try {
        const comments = await Comment.find({postId: req.params.postId})


        return res.status(200).json(comments)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
          success:false,
          massage:"Error"
      })
    }
}


exports.createComment = async(req, res) => {
        try {
           const createdComment = await Comment.create({...req.body, userId: req.user.id})
    
           return res.status(201).json(createdComment)
        } catch (error) {
          console.log("error in comment")
          console.error(error)
          return res.status(500).json({
              success:false,
              massage:"Error"
          })
        }
}


exports.deleteComment = async(req, res) => {
    try {
       const comment = await Comment.findById(req.params.commentId)
       
       if(comment.userId === req.user.id){
         await Comment.findByIdAndDelete(req.params.commentId)
         return res.status(200).json({msg: "Comment has been successfully deleted"})
       } else {
         return res.status(403).json({msg: "You can delete only your own comments"})
       }
    } catch (error) {
      console.error(error)
      return res.status(500).json({
          success:false,
          massage:"Error"
      }) 
    }
}


exports.toggleLike = async(req, res) => {
    try {
      const currentUserId = req.user.id
      const comment = await Comment.findById(req.params.commentId)
      
      if(!comment.likes.includes(currentUserId)){
        comment.likes.push(currentUserId)
        await comment.save()
        return res.status(200).json({msg: "Comment has been successfully liked!"})
      } else {
        comment.likes = comment.likes.filter((id) => id !== currentUserId)
        await comment.save()
        return res.status(200).json({msg: "Comment has been successfully unliiked"})
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({
          success:false,
          massage:"Error"
      }) 
    }
}

