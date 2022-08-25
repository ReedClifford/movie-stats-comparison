// API key:56bf57e1
const url = "http://www.omdbapi.com/";

const autoCompleteConfig = {
  renderOption(show) {
    const imgSrc =
      show.Poster === "N/A"
        ? "https://www.reelviews.net/resources/img/default_poster.jpg"
        : show.Poster;
    return `
        <img src = "${imgSrc}"/>
        <h3> ${show.Title} (${show.Year})</h3>
        `;
  },

  inputValue(show) {
    return show.Title;
  },
  async fectchData(searcheMovie) {
    try {
      const res = await axios.get(url, {
        params: {
          apikey: "56bf57e1",
          s: searcheMovie,
        },
      });
      const data = res.data;
      if (data.Error) {
        return [];
      }
      return data.Search;
    } catch (error) {
      return error;
    }
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(show) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(show, document.querySelector("#left-summary"), "left");
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(show) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(show, document.querySelector("#right-summary"), "right");
  },
});
const onMovieSelect = async (selectedMovie, element, side) => {
  const response = await axios.get(url, {
    params: {
      apikey: "56bf57e1",
      i: selectedMovie.imdbID,
    },
  });
  console.log(response.data);
  element.innerHTML = movieTemplate(response.data);
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSide = document.querySelectorAll("#left-summary .notification");

  const rightSide = document.querySelectorAll("#right-summary .notification");

  leftSide.forEach((leftstats, index) => {
    const rightStat = rightSide[index];
    const leftSideVal = leftstats.dataset.value;
    const rightSideVal = rightStat.dataset.value;
    console.log(leftstats.dataset.value);

    if (rightSideVal > leftSideVal) {
      leftstats.classList.remove("is-link");
      leftstats.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-link");
      rightStat.classList.add("is-warning");
    }
  });
};

const movieTemplate = (details) => {
  const dollars = parseInt(
    details.BoxOffice.replace(/,/g, "").replace(/\$/g, "")
  );
  const metaScore = parseInt(details.metaScore);
  const rating = parseFloat(details.imdbRating);
  const votes = parseFloat(details.imdbVotes.replace(/,/g, ""));

  const awards = details.Awards.split(" ").reduce((prev, current) => {
    const val = parseInt(current);
    if (isNaN(val)) {
      return prev;
    } else {
      return prev + val;
    }
  }, 0);

  console.log(awards);
  console.log(dollars, metaScore, rating, votes);

  return `
  <article class="media card">
    <figure class="media-left">
      <p class='image'>
     
        <img src="${details.Poster}" alt=""/>

      </p>
    
    </figure>
   

    

    <div class="media-content">
      <div class = "content">
        <h1>${details.Title}</h1>
        <h4>${details.Genre}</h4>
        <p>${details.Plot}</p>
      
      </div>
    
    </div>
  </article>

  <article data-value=${awards} class="notification is-link  is-light">
    <p class="title">${details.Awards}</p>
    <p class="subtitle">Awards</p>
  
  </article>

    <article data-value=${dollars} class="notification is-link  is-light">
    <p class="title">${details.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  
  </article>
  <article data-value=${metaScore} class="notification is-link  is-light">
    <p class="title">${details.MetaScore}</p>
    <p class="subtitle">Meta Score</p>

  </article>
  <article data-value=${rating} class="notification is-link  is-light">
    <p class="title">${details.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>

  </article>
  <article data-value${votes} class="notification is-link  is-light">
    <p class="title">${details.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>

  </article>
 

  
  
  
  
  `;
};
