const apiKey = 'c5b0c54ba2eca16a585415f81e9d17e2'; 
const cityButtons = document.querySelectorAll('.city-button');
const tiles = document.querySelectorAll('.is-vertical');
const card = document.querySelector('.card');

Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}

Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}
  
// Check if a city has been previously selected and update the cards/tiles accordingly
let data = localStorage.getObj("dataCookie");

if (data) {
  populatePage(data);
}

cityButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    // button.classList.add('is-active');
   const city = event.target.textContent;
    // Enter the clicked city into the API call
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      let lat = data[0].lat;
      let lon = data[0].lon;

  // Create lat, lon variables from the data and enter as params in the next API call
    getWeather(lat,lon);
    })
    .catch(error => console.error(error));      
  });
});

getWeather = (lat, lon) => {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
  .then(response => response.json())
  .then(data => {
    populatePage(data);
    localStorage.setObj("dataCookie", data);
      }) 
  .catch(error => console.error(error));
};

function populatePage(data) {
        // Set the content for the hero tile    
        card.querySelector('li:nth-child(1)').textContent = 'Temp: '+ data.list[0].main.temp +' F';
        card.querySelector('li:nth-child(2)').textContent= 'Wind: ' + data.list[0].wind.speed +' MPH';
        card.querySelector('li:nth-child(3)').textContent = 'Humidity: ' + data.list[0].main.humidity + '%';
        
      //set the content for 5-day tiles  
      tiles.forEach((tile, index) => {
        tile.querySelector('li:nth-child(1)').textContent = 'Temp: ' + data.list[index * 8].main.temp +' F';
        tile.querySelector('li:nth-child(2)').textContent = 'Wind: ' + data.list[index * 8].wind.speed +' MPH';
        tile.querySelector('li:nth-child(3)').textContent = 'Humidity: ' + data.list[index * 8].main.humidity + '%';
        
        const dateStr = data.list[index * 8].dt_txt;
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US');

        tile.querySelector('.subtitle').textContent = formattedDate;
        card.querySelector('.title').textContent = data.city.name;
  })
};

