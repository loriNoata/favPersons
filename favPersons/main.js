let mainApp=(function(){
	let toDoList = "https://jsonplaceholder.typicode.com/todos/" ;
var numberOfLoads = 10; 
const url = 'https://randomuser.me/api/?results='; //   Get 10 random users
var boxTemplateId = $("#boxTemplateId").html();
var favListTemplateId = $("#favListTemplateId").html();
var modalTemplateId = $("#modalTemplateId").html();
var usersAll;  
var usersFemale;
var usersMale;
var favList=[]; 
var isActiveSearch = false; 
//let boolSelectedGender =  false;
loadData(); 
 

function loadData() {
	fetch(url+numberOfLoads)
	.then(response => response.json())
	.then(users =>  getAllData(users));  
 }
 
function loadMoreData() {
	numberOfLoads +=  10; 
	loadData(); 
}

function selectOptionGender() {
	let selector, gender, newUsers =[]; 
	selector = $("#selectGender").val();
	gender = setGender(selector);
	//loadSelected(selector);
	if (isActiveSearch) {
		newUsers = searchForUsers(gender);
		displayUsers(newUsers); 

	} else {
		displayUsers(gender); 
	}
}


function displayFavList(elm) {
	var counter, parentElm, userFav ; 
	parentElm = $(elm).parent().parent(); 
 
	parentElmAttr =  parentElm.attr("data-container-box"); 
	userFav = getUserByEmail(parentElmAttr); 
	counter = addToFavList(userFav, parentElm); 
	 
	$(".favCounter").val(counter); 
	$(".favorites").html(counter);
}

function setGender(selector) { 
	if (selector === "male" ) {
		return usersMale;  
	} else if (selector === "female" )  {
		return usersFemale ;
	} else {
		return usersAll;
	}
}

function getUserByEmail(email) {
	var userByEmail; 
	userByEmail = usersAll.filter(hasEmail); 
	function hasEmail(user) {
		if (email === user.email) {
			return true; 
		}
	}
	return userByEmail;
}

function addToFavList(userArr, elm) {
	var isDuplicate, counter, user; 
	counter = $(".favCounter").val();
	user = userArr[0];
	isDuplicate = favList.filter(hasSameEmail);
	
	function hasSameEmail(fav) {
		if (fav.email === user.email ) {
			return true; 
		}
	}

	if (isDuplicate.length == 0) { // if isDuplicate == 0 => we could add it into the list
		counter++; 
		favList.push(user);
	} else { //else we add message the the element is in Fav list
		elm.prepend(" <div style='position:absolute; bottom:50px; left: 5px; border:1px solid grey; background-color: lightgrey;  padding:12px 20px; '>  It's already in your favorite list  </div>" );
	}

	return counter; 
}

 function deleteBox(eMail) {
	usersAll = usersAll.filter(hasSameEmail);
	function hasSameEmail(users) {
		if (users.email !== eMail ) {
			return true; 
		}
	}
	numberOfLoads--; 
	displayUsers(usersAll);
	return usersAll; 
 }
 
  
function toggleFavContainer() {
	$(".favList").toggleClass("openList");  
	$(".favListContent").toggleClass("hidded");	 
	
	loadFavList(favList);
}
 
function getAllData(users) {
	usersAll = users.results;
	usersFemale =[];
    usersMale = [] ;
	usersAll.forEach(addToMapByGender); 
	
	function addToMapByGender(user) {
		if (user.gender === "male") {
			usersMale.push(user); 
		} else   {
			usersFemale.push(user); 
		} 
	} 
	 
	displayUsers(usersAll); 
}
 
 
 
function searchForUsers() {
	let arryToSearch=[], findedUsers = [], inputTxt, selectedGender; 
	 
	selectedGender = $("#selectGender option:selected" ).val();
	arryToSearch = setGender(selectedGender);

	inputTxt = $("#inputSearch").val();
	
	if (inputTxt !== undefined && inputTxt!=="") {
		findedUsers = arryToSearch.filter(isNameLikeInSearch); 
		isActiveSearch = true; 
		console.log(isActiveSearch);
		function isNameLikeInSearch(user) {
			if ((user.name.first.indexOf(inputTxt) > -1 ) || (user.name.last.indexOf(inputTxt) > -1 )){
				return true; 
			} 
		}
		displayUsers(findedUsers);
		
		return findedUsers; 
	} else {
		isActiveSearch = false; 
		console.log(isActiveSearch);
		displayUsers(arryToSearch);
		return arryToSearch;
	}
} 


function displayUsers(users) {
	let  boxTemplateHtml = '';
	let  modalHtml = '' ; 


	if (users.length >=1) {
		boxTemplateHtml = Mustache.to_html(boxTemplateId, users);
		$(".bodyWrapper").html(boxTemplateHtml); 
		 
	} else {
		$(".bodyWrapper").html("Sorry, there is no user "); 
	}
}

function loadFavList(favUsers) {
	let favListTemplateHtml; 
	console.log(favUsers);
	if (favUsers.length >=1) {
		favListTemplateHtml = Mustache.to_html(favListTemplateId, favUsers);
		$(".favListContent").html(favListTemplateHtml);
	} else {
		$(".favListContent").html("No favorite users selected"); 
	}
	
}

function openChart() {
	var ctx = document.getElementById("myChart");
	var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
}

 // Initialize and add the map
function initMap() {
	debugger; 
  // The location of Uluru
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('myMap'), {zoom: 4, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
}
 

 	
	
	return{
		toggleFavContainer: toggleFavContainer, 
		searchForUsers : searchForUsers, 
		selectOptionGender : selectOptionGender, 
		displayFavList : displayFavList,
		displayUsers : displayUsers, 
		/*seeDetails : seeDetails,  */
		loadMoreData : loadMoreData, 
		openChart : openChart, 
		deleteBox : deleteBox, 
		initMap: initMap
	}
})();
 
