const AUTHORIZATION_TOKEN = '';
const userContainer = document.querySelector('.user-container');
const form = document.querySelector('form');
const loader = document.querySelector('.loader-container');

const getUserData = async (user) => {
   userContainer.innerHTML = '';
   addLoader();
   try {
      const response = await fetch(`https://api.github.com/graphql`, {
         method: 'POST',
         headers: {
            'Content-type': 'Application/json',
            'User-Agent': 'request',
            Authorization: `token ${AUTHORIZATION_TOKEN}`,
         },

         body: JSON.stringify({
            query: `
           query {
                user(login: "${user}") {
                    avatarUrl
                    login
                    bio
                    name
                    repositories(last: 20) {
                    nodes {
                        updatedAt
                        description
                        forkCount
                        name
                        languages {
                        nodes {
                            color
                            id
                            name
                            }
                        }
                        stargazerCount
                        url
                    }
                    }
                }
            }
           `,
         }),
      });

      const data = await response.json();
      addDataToDom(data);
   } catch (err) {
      removeLoader();
      userContainer.innerHTML = errorMessageEl(`Something went wrong`);
   }
};

const addDataToDom = (data) => {
   removeLoader();
   userContainer.innerHTML = data.data.user
      ? userDetailsEl(data)
      : errorMessageEl(`User doesn't exist`);
};

const userDetailsEl = (data) => {
   const { avatarUrl, login, bio, name, repositories } = data.data.user;

   return `    <div class="user-info">
               <div class="user-image">
                  <img src="${avatarUrl}" alt="" />
               </div>
               <div class="username">
                  <h2>${name}</h2>
                  <p>${login}</p>
               </div>

               <p class="user-description">
                  ${bio ? bio : ''}
               </p>
            </div>

            <div class="user-repos">
               <p>${
                  repositories.nodes.length
               } results for public Repositories</p>
               <div class="repositories-container">
                  ${repositoryEl(repositories.nodes)}
                  </div>
               </div>
            </div>`;
};
// getUserData('Adepiper');

const repositoryEl = (repositories) =>
   repositories
      .map((repository) => {
         const splitedDate = repository.updatedAt.split('T')[0];
         const date = new Date(splitedDate);
         const newDate = date.toDateString().split(' ');
         const finalDate = newDate.slice(1, newDate.length).join(' ');

         return `<div class="repository">
                     <div class="repo-details">
                        <a href="${repository.url}" target="_blank">
                           ${repository.name}
                        </a>
                        <p>
                           ${
                              repository.description
                                 ? repository.description
                                 : ''
                           }
                        </p>
                     </div>
                     <div class="repo-info">
                        <div class="language">
                           <div></div>
                           <span>HTML</span>
                        </div>
                        <div class="stars">
                           <i class="far fa-star"></i>
                           <span>${repository.stargazerCount}</span>
                        </div>

                        <div class="code-branch">
                           <i class="fas fa-code-branch"></i>
                           <span>${repository.forkCount}</span>
                        </div>
                        <p>${finalDate}</p>
                     </div>

                     <button class="star-repo">
                        <i class="far fa-star"></i> <span>Star</span>
                     </button>
                  </div>`;
      })

      .join('');

form.addEventListener('submit', function (e) {
   e.preventDefault();
   const input = form.querySelector('input');
   if (input.value === '') {
      input.style.borderColor = 'rgba(255, 0, 0, 0.36)';
      return (userContainer.innerHTML = errorMessageEl(
         `Please enter a username`
      ));
   }
   getUserData(input.value);
});

const errorMessageEl = (error) =>
   `  <div class="user-info">
               <div class="user-image">
               </div>
               <div class="username">
                  <h2></h2>
                  <p></p>
               </div>

               <p class="user-description">
               </p>
            </div>

            <div class="user-repos">
               <p>
               ${error}
               
               </p>
               </div>
            </div>`;

const addLoader = () => (loader.style.display = 'flex');
const removeLoader = () => (loader.style.display = 'none');
