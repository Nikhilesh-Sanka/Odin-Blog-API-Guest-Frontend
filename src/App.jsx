import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`https://blog-api-odin.adaptable.app/guest/posts`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((posts) => {
        setPosts(posts);
        setFilteredPosts(posts);
      });
    fetch(`https://blog-api-odin.adaptable.app/guest/categories`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((categories) => setCategories(categories));
  }, []);
  return (
    <div className="app">
      <h1>Odin Blog API</h1>
      <div className="container">
        <SearchBar setFilteredPosts={setFilteredPosts} posts={posts} />
        <Categories
          categories={categories}
          setFilteredPosts={setFilteredPosts}
          posts={posts}
        />
        <Display filteredPosts={filteredPosts} />
      </div>
    </div>
  );
}

function SearchBar(props) {
  const searchField = useRef(null);
  function handleSearch() {
    const searchValue = searchField.current.value;
    const newFilteredPosts = props.posts.filter((post) =>
      post.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    props.setFilteredPosts(newFilteredPosts);
  }
  if (searchField.current !== null) {
    searchField.current.addEventListener("keypress", (e) => {
      if (e.keyCode === 13) {
        handleSearch();
        searchField.current.focus();
      }
    });
  }
  return (
    <div className="search-bar">
      <input type="text" ref={searchField} />
      <button onClick={handleSearch}>search</button>
    </div>
  );
}

function Display(props) {
  return (
    <div className="display">
      {props.filteredPosts.map((filteredPost) => {
        return <Post post={filteredPost} key={filteredPost.id} />;
      })}
    </div>
  );
}

function Post(props) {
  const navigate = useNavigate();
  function viewPost(postId) {
    navigate(`/post/${postId}`);
  }
  return (
    <div
      className="post"
      onClick={() => {
        viewPost(props.post.id);
      }}
    >
      <h2>{props.post.title}</h2>
      <p>{props.post.creationDate.slice(0, 10)}</p>
      <p>author:{props.post.author.name}</p>
      <div className="categories">
        {props.post.categories.map((category) => {
          return (
            <div className="category" key={category.id}>
              <p>{category.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Categories(props) {
  const categoryDiv = useRef(null);
  function handleClick(e) {
    e.target.classList.toggle("clicked");
    const categoriesFiltered = [];
    for (let btn of categoryDiv.current.childNodes) {
      if (btn.classList.contains("clicked")) {
        categoriesFiltered.push(btn.id);
      }
    }
    if (categoriesFiltered.length !== 0) {
      filterPosts(categoriesFiltered);
    } else {
      props.setFilteredPosts(props.posts);
    }
  }
  function filterPosts(filteredCategories) {
    const newFilteredPosts = props.posts.filter((post) => {
      let result = true;
      for (let i of filteredCategories) {
        result =
          result &&
          post.categories.some((category) => category.id === parseInt(i));
      }
      return result;
    });
    props.setFilteredPosts(newFilteredPosts);
  }
  function clearFilters() {
    props.setFilteredPosts(props.posts);
    for (let node of categoryDiv.current.childNodes) {
      if (node.classList.contains("category-btn")) {
        node.classList.remove("clicked");
        continue;
      }
    }
  }
  return (
    <div className="categories" ref={categoryDiv}>
      <h2>Categories</h2>
      {props.categories.map((category) => {
        return (
          <button
            id={category.id}
            key={category.id}
            className="category-btn"
            onClick={handleClick}
          >
            {category.name}
          </button>
        );
      })}
      <div className="clear-filter-btn">
        <button onClick={clearFilters}>clear filters</button>
      </div>
    </div>
  );
}

export default App;
