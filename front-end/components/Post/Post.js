import React from 'react'

const Post = (props) => {
  return (
    <button className="border border-gris h-[33vw] w-[33vw]">
        <img src={props.url} alt="Image" className="object-cover w-full h-full" />
    </button>
  )
}

export default Post