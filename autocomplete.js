const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fectchData,
}) => {
  //   const root = document.querySelector(".autocomplete");
  root.innerHTML = `

<input id="searchBar1" class="input is-normal" placeholder = "Search"/>
<div class="dropdown">
  <div class="dropdown-menu results" >
    <div class="dropdown-content">
      
    </div>
  </div>
</div>

`;

  const search = root.querySelector("#searchBar1");
  const dropDown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".dropdown-content");
  //   const img = document.querySelector(".img");

  let timeOutId;

  const input = async (e) => {
    console.log(e.target.value);
    const items = await fectchData(e.target.value);

    if (!items.length) {
      dropDown.classList.remove("is-active");

      return;
    }

    console.log(items);
    resultsWrapper.innerHTML = "";
    dropDown.classList.add("is-active");

    for (let item of items) {
      const results = document.createElement("a");

      results.innerHTML = renderOption(item);
      results.addEventListener(
        "click",
        debounce(() => {
          dropDown.classList.remove("is-active");
          search.value = inputValue(item);

          onOptionSelect(item);
        }, 500)
      );

      results.classList.add("dropdown-item");

      resultsWrapper.appendChild(results);
    }
  };

  search.addEventListener("input", debounce(input, 500));

  document.addEventListener("mouseover", (e) => {
    if (!root.contains(e.target)) {
      dropDown.classList.remove("is-active");
    } else {
      dropDown.classList.add("is-active");
    }
  });
};
