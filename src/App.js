import React, {useState, useEffect} from 'react';
import "./App.css";

function App() {

  const key = "fd5533de5ca2bde3e3d7ca9f8c4792f5";
  // Format today's date for the API
  const formatTime = () => {
    const today = new Date(Date.now());
    return `${today.getYear() + 1900}`
    + `-${today.getMonth() >= 10 ? today.getMonth() : "0" + today.getMonth().toString()}`
    + `-${today.getDate() >= 10 ? today.getDate() : "0" + today.getDate().toString()}`;
  }

  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("None");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(`https://gnews.io/api/v3/search?q=None&token=${key}`);

  const fetchArticles = () => {
    setLoading(true);
    console.log(url);
    fetch(url)
    .then(result => result.json())
    .then(data => {setArticles(data.articles); setLoading(false)})
    .catch(error => console.log(error));
    setLoading(false);
  }

  useEffect(() => {
    fetchArticles();
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setUrl(`https://gnews.io/api/v3/search?q=${searchQuery}&token=${key}`);
  }

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  }

  const showNavBar = () => {
    return (
      <nav className="navbar navbar-dark bg-dark" id="nav">
        <a className="navbar-brand" href="#">GNews Search</a>
        {showSearchForm()}
      </nav>
    );
  }

  const showSearchForm = () => {
    return (
      <form className="form-inline" onSubmit={handleSubmit}>
          <input className="form-control" type="text" value={searchQuery} onChange={handleChange} placeholder="Search"/>
          <button className="btn btn-success">Search</button>
      </form>
    );
  }

  const showBody = () => {
    return (
      !loading ? showStories() : showLoader()
    );
  }

  const showStories = () => {
    return (
      <div className="container">
        {articles.map((story, index) => showStory(story, index))}
      </div>
    );
  }

  const showStory = (story, index) => {
    return (story.image != null) ? showStoryWithImage(story, index) : showStoryWithoutImage(story, index);
  }

  const showStoryWithImage = (story, index) => {
    return (
      <div className="card news-card" key={index}>
        <div className="row">
          <div className="col-md-4">
            <img src={story.image} className="card-img" alt={story.title}/>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5><a href={story.url} target="_blank">{story.title}</a></h5>
              <p className="card-text">{story.description}</p>
              <p className="card-text"><small className="text-muted">{story.publishedAt.slice(0,10)}</small></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showStoryWithoutImage = (story, index) => {
    return (
      <div className="card news-card" key={index}>
        <div className="row">
          <div className="col-md">
            <div className="card-body">
              <h5><a href={story.url} target="_blank">{story.title}</a></h5>
              <p className="card-text">{story.description}</p>
              <p className="card-text"><small className="text-muted">{story.publishedAt.slice(0,10)}</small></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showLoader = () => {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showNavBar()}
      {showBody()}
    </div>
  );
}

export default App;
