const apiKey = 'c5b0c54ba2eca16a585415f81e9d17e2'; 
const cityButtons = document.querySelectorAll('.city-button');
const tiles = document.querySelectorAll('.is-vertical');
const mainTitle = document.querySelector('.is-3');
  
// Check if a city has been previously selected and update the mainTitle accordingly
if (localStorage.getItem('selectedCity')) {
  mainTitle.textContent = localStorage.getItem('selectedCity');
}

cityButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    const city = e.target.textContent;
    mainTitle.textContent = city;
    // Save the selected city to localStorage
    localStorage.setItem('selectedCity', city);

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      let lat = data[0].lat;
      let lon = data[0].lon;

      getWeather(lat,lon);
    })
    .catch(error => console.error(error));      
  });
});

getWeather = (lat, lon) => {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
  .then(response => response.json())
  .then(data => {
      // Set the content of the first tile
      const firstTileTemp = 'Temperature: ' + data.list[0].main.temp + ' F';
      const firstTileWind = 'Wind: ' + data.list[0].wind.speed + ' MPH';
      const firstTileHumidity = 'Humidity: ' + data.list[0].main.humidity + '%';
      const ul = document.createElement('ul');
      const tempLi = document.createElement('li');
      tempLi.textContent = firstTileTemp;
      const windLi = document.createElement('li');
      windLi.textContent = firstTileWind;
      const humidityLi = document.createElement('li');
      humidityLi.textContent = firstTileHumidity;
    
      ul.appendChild(tempLi);
      ul.appendChild(windLi);
      ul.appendChild(humidityLi);
      
      mainTitle.appendChild(ul);
      // Save the selected values to localStorage
localStorage.setItem('temp', tempLi.textContent);
localStorage.setItem('wind', windLi.textContent);
localStorage.setItem('humidity', humidityLi.textContent);
    

    //set the content for 5-day tiles  
    tiles.forEach((tile, index) => {
      tile.querySelector('li:nth-child(1)').textContent = 'Temperature: ' + data.list[index * 8].main.temp +' F';
      
      tile.querySelector('li:nth-child(2)').textContent = 'Wind: ' + data.list[index * 8].wind.speed +' MPH';
      tile.querySelector('li:nth-child(3)').textContent = 'Humidity: ' + data.list[index * 8].main.humidity + '%';
      
      const dateStr = data.list[index * 8].dt_txt;
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString('en-US');

      tile.querySelector('.title').textContent = formattedDate;
  
    })
  })
  .catch(error => console.error(error));
};