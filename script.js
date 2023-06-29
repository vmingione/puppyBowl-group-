
const newPlayerFormContainer = document.getElementById('new-player-form');
const playerContainer = document.getElementById('all-players-container');


// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-acc-et-web-pt';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
       const players = await response.json();
       console.log(players)

       return players;

    } catch (err) {
        console.log('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (id) => {
    try {
        const response= await fetch(`${APIURL}/${id}`)
        let players = await response.json();
        players = players.data.player;
        console.log(players);
        const playerElement = document.createElement('div');
        playerElement.classList.add('players');
        playerElement.innerHTML = `
            <h4><b>ID: </b>${players.id}</h4>
            <h4><b>Breed: </b>${players.breed}</h4>
            <p><b>Status: </b>${players.status}</p>
            <p><b>Created At: </b>${players.createdAt}</p>
            <p><b>Updated At: </b>${players.updatedAt}</p>
            <p><b>Team ID: </b>${players.teamId}</p>
            <p><b>Cohort ID: </b>${players.cohortId}</p>`;


        const playerId = document.getElementById(id);
        playerId.appendChild(playerElement);
        console.log(response);
        return players
    } catch (err) {

        console.log(`Oh no, trouble fetching player #${id}!`, err);
    }
};

const addNewPlayer = async (name, url, breed) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            body: JSON.stringify({name,url,breed}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const player = await response.json();
        console.log(player);
        const players = await fetchAllPlayers();
        renderAllPlayers(players);

    } catch (err) {
        console.log('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (id) => {
    try {
        const response = await fetch(`${APIURL}/${id}`, {
            method: 'DELETE',
        });
        const player = await response.json();
        console.log(player);
        fetchAllPlayers();
        window.location.reload();
 
    } catch (err) {
        console.log(
            `Whoops, trouble removing player #${id} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (players) => {
    try {
        // if (!playerList || playerList.length === 0) {
        //     playerContainer.innerHTML = '<h3>No players found</h3>';
        //     return;
        // }
    
        playerContainer.innerHTML = '';
    
        players.data.players.forEach((player) => {
            const playerElement = document.createElement('span');
            playerElement.classList.add('player');
            playerElement.innerHTML = `
                <h2>${player.name}</h2>
                <img class="image"src="${player.imageUrl}">
                <p>See details below</p>

                <button class="delete-button" data-id="${player.id}">Remove</button>
                <button class="detail-button" data-id="${player.id}">See Details</button>
            `;

                playerElement.setAttribute("id", player.id);
            playerContainer.appendChild(playerElement);
    
            let deleteButton = playerElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                removePlayer(player.id);
            });    
            let detailButton = playerElement.querySelector('.detail-button');
            detailButton.addEventListener('click', async (event) => {
                event.preventDefault();
                await fetchSinglePlayer(player.id);        
            },{once:true});
        });

        
    } catch (err) {
        console.log('Uh oh, trouble rendering players!', err);
    }

};
const renderNewPlayerForm = () => {
    try {
        let formHtml = `
        <form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Name">
        <label for="imageUrl">Image URL</label>
        <input type="text" id="status" name="imageUrl" placeholder="Image URL">
        <label for="breed">Status (field or bench)</label>
        <input type="text" id="imageUrl" name="imageUrl" placeholder="field or bench">
        <label for="breed">Breed</label>
        <textarea id="breed" name="breed" placeholder="Breed"></textarea>
        <button id= "formBtn" type="submit">Create</button>
        </form>
        `;
        newPlayerFormContainer.innerHTML = formHtml;
    
        let form = newPlayerFormContainer.querySelector('form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            let name = document.getElementById("name").value;
            let imageUrl=document.getElementById("imageUrl").value;

            let breed=document.getElementById("breed").value;
    
            await addNewPlayer(name,imageUrl,breed);
            
            form.reset();

        });
    
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

async function init() {
    try{
   const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
    } catch (err) {
        console.log (err)
    }

}
init();
