import React from 'react'
import classes from './friends.module.css'
import person from '../../assets/person1.jpg'
import { useState } from 'react'
import { useEffect } from 'react'
import { request } from '../../util/request'
import { useSelector } from 'react-redux'

const Friends = () => {
  const [friends, setFriends] = useState([])
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchFriends = async () => {
      const friends = await request(`/api/v1/find/userfriends/${user._id}`)
      setFriends(friends)
    }
    fetchFriends()
  }, [])

  console.log(friends)


  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {friends?.length > 0 ? <h3>Your friends</h3> : ''}
        {friends?.length > 0 ? friends?.map((friend) => (
          <div key={friend._id} className={classes.friend}>
            <img src={friend?.profilePic ? `https://facebook-g6fm.onrender.com/images/${friend?.profilePic}` : person} className={classes.friendImg} alt="" />
            <span>{friend.username}</span>
          </div>
        )) : <h3 style={{textAlign: 'center'}}>You currently have no friends</h3>}
      </div>
    </div>
  )
}

export default Friends