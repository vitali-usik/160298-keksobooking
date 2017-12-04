'use strict';

var removeMapFadded = function () {
  var mapElement = document.querySelector('.map');
  mapElement.classList.remove('map--faded')
};

function generateRandomNumber(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

var generateAds = function () {
  var AD_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var AD_TYPE = ['flat', 'house', 'bungalo'];
  var AD_CHECKIN = ['12:00', '13:00', '14:00'];
  var AD_CHECKOUT = ['12:00', '13:00', '14:00'];
  var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var ads = [];
  var ADS_SIZE = 8;

  for (var i = 0; i < ADS_SIZE; i++) {
    var locationX = generateRandomNumber(300, 900);
    var locationY = generateRandomNumber(100, 500);

    ads[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png' // строка, адрес изображения вида img/avatars/user{{xx}}.png, где xx это число от 1 до 8 с ведущим нулем. Например 01, 02 и т. д. Адреса изображений не повторяются
      },
      offer: {
        title: AD_TITLE[i], // строка, заголовок предложения, одно из фиксированных значений "Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде". Значения не должны повторяться.
        address: locationX + ', ' + locationY, //строка, адрес предложения, представляет собой запись вида "{{location.x}}, {{location.y}}"
        price: generateRandomNumber(1000, 1000000), //число, случайная цена от 1000 до 1 000 000
        type: AD_TYPE[generateRandomNumber(0, 2)], //строка с одним из трех фиксированных значений: flat, house или bungalo
        rooms: generateRandomNumber(1, 5), // число, случайное количество комнат от 1 до 5
        guests: generateRandomNumber(1, 10), //число, случайное количество гостей, которое можно разместить
        checkin: AD_CHECKIN[generateRandomNumber(0, 2)], //строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00,
        checkout: AD_CHECKOUT[generateRandomNumber(0, 2)], // строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00
        features: AD_FEATURES.slice(0, generateRandomNumber(1, 6)), // массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
        description: '',
        photos: ''
      },
      location: {
        x: locationX, //случайное число, координата x метки на карте от 300 до 900,
        y: locationY // случайное число, координата y метки на карте от 100 до 500
      }
    }
  }

  return ads;
};

var renderAds = function (ads) {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderAdvert(ads[i]));
  }

  mapPins.appendChild(fragment);
};

var renderAdvert = function (ad) {
  var button = document.createElement('button');
  button.style.left = ad.location.x + 'px';
  button.style.top = ad.location.y + 'px';
  button.classList.add('map__pin');

  var image = document.createElement('img');
  image.src = ad.author.avatar;
  image.width = 40;
  image.height = 40;
  image.setAttribute('draggable', 'false');

  button.appendChild(image);

  return button;
};

var getType = function (innerType) {
  var type = '';

  switch (innerType) {
    case 'flat':
      type = 'Квартира';
      break;
    case 'house':
      type = 'Дом';
      break;
    case 'bungalo':
      type = 'Бунгало';
      break;
  }

  return type;
};

var showAdFullInfo = function (ad) {
  var infoBlockTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var infoBlock = infoBlockTemplate.cloneNode(true);

  infoBlock.querySelector('h3').textContent = ad.offer.title;
  infoBlock.querySelector('p small').textContent = ad.offer.address;
  infoBlock.querySelector('.popup__price').textContent = ad.offer.price + '\u20BD ' + '/ ночь';
  infoBlock.querySelector('h4').textContent = getType(ad.offer.type);

  var paragraphs = infoBlock.querySelectorAll('p');
  paragraphs[2].textContent = ad.offer.rooms + ' для ' + ad.offer.guests + ' гостей';
  paragraphs[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  paragraphs[4].textContent = ad.offer.description;

  var featuresList = infoBlock.querySelector('.popup__features');
  while (featuresList.firstChild) {
    featuresList.removeChild(featuresList.firstChild);
  }

  for (var i = 0; i < ad.offer.features.length; i++) {
    var featuresListItem = document.createElement('li');
    featuresListItem.className = 'feature feature--' + ad.offer.features[i];
    featuresList.appendChild(featuresListItem);
  }

  infoBlock.querySelector('.popup__avatar').src = ad.author.avatar;
  document.querySelector('.map').insertBefore(infoBlock, document.querySelector('.map__filters-container'));
};

var initMap = function () {
  var ads = [];
  console.log('initMap(): map.js');
  removeMapFadded();
  var ads = generateAds();
  console.log('ads', ads);
  renderAds(ads);
  showAdFullInfo(ads[0]);
};

initMap();