const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

async function getUser(username) {
  try {
    // Send a GET request to the APIURL with the given username and wait for the response
    const { data } = await axios(APIURL + username);
    // If the response is successful, call the createUserCard function with the data returned
    createUserCard(data);
    // Call the getRepos function with the username to get the user's repositories
    getRepos(username);
  } catch (err) {
    // If there is an error, check if the error response status is 404 (Not Found)
    if (err.response.status == 404) {
      // If it is, call the createErrorCard function with a message indicating that no profile was found for the given username
      createErrorCard("No profile with this username");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem ferching repos");
  }
}

function createUserCard(user) {
  const cardHTML = `<div class="card">
    <div>
    <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
    <h2>${user.name}</h2>
    <p>${user.bio}</p>
    <ul>
    <li>${user.followers} <strong>Followers</strong></li>
    <li>${user.following} <strong>Following</strong></li>
    <li>${user.public_repos}<strong>Repositories</strong></li>
    </ul>
    <div id="repos">
    </div>
    </div>
    </div>`;
  main.innerHTML = cardHTML;
}
function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
        <h1>${msg}</h1>
    </div>
    `;
  main.innerHTML = cardHTML
}

function addReposToCard(repos){
    const reposEl = document.getElementById('repos')

    repos.slice(0,10).forEach(repo => {
        const repoEl = document.createElement('a')
        repoEl.classList.add('repo')
        repoEl.href = repo.html_url
        repoEl.target = '_blank'
        repoEl.innerText = repo.name
        reposEl.appendChild(repoEl)
    })
}

form.addEventListener('submit', e => {
    e.preventDefault()
    const user = search.value
    if(user){
        getUser(user)
        search.value = ''
    }
})
