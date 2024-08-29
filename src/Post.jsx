import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function ViewPost() {
  const [post, setPost] = useState(null);
  const [commentStatus, setCommentStatus] = useState(false);
  const [dummy, setDummy] = useState({});
  const form = useRef(null);
  const { postId } = useParams();
  useEffect(() => {
    fetch(`https://blog-api-odin.adaptable.app/guest/posts/${postId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((post) => setPost(post));
  }, [dummy]);
  function handleAddCommentBtn() {
    setCommentStatus(!commentStatus);
  }
  function closeCommentBox() {
    setCommentStatus(false);
  }
  async function addComment(e) {
    e.preventDefault();
    let formElement = form.current;
    let authorName = formElement.childNodes[0].childNodes[2];
    let comment = formElement.childNodes[1].childNodes[2];
    if (authorName.value.trim() === "") {
      authorName.setCustomValidity("author name cannot be empty");
      authorName.reportValidity();
      return;
    }
    if (comment.value.trim() === "") {
      comment.setCustomValidity("comment cannot be empty");
      comment.reportValidity();
      return;
    }
    const response = await fetch(
      `https://blog-api-odin.adaptable.app/guest/posts/${post.id}/comments`,
      {
        method: "POST",
        body: JSON.stringify({
          author: authorName.value,
          comment: comment.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 201) {
      setDummy({});
      setCommentStatus(false);
    }
  }
  return (
    <div className="view-post">
      {post ? (
        <>
          <h1>{post.title}</h1>
          <div className="main-content">
            <p>{post.creationDate.slice(0, 10)}</p>
            <p>by:{post.author.name}</p>
            <div className="categories">
              {post.categories.map((category) => {
                return (
                  <div className="category" key={category.id}>
                    {category.name}
                  </div>
                );
              })}
            </div>
            <p>{post.content}</p>
          </div>
          <button onClick={handleAddCommentBtn} className="add-comment-btn">
            Add a comment
          </button>
          {commentStatus ? (
            <form ref={form}>
              <label>
                Your Name:
                <br />
                <input type="text" />
              </label>
              <label>
                Comment:
                <br />
                <textarea></textarea>
              </label>
              <button onClick={addComment}>add comment</button>
              <button type="button" onClick={closeCommentBox}>
                close
              </button>
            </form>
          ) : null}
          <div className="comments">
            {post.comments.map((comment) => {
              return (
                <div className="comment" key={comment.id}>
                  <p>Author: {comment.authorName}</p>
                  <p>Comment: {comment.comment}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
