/**
Naif Alfayez
CSC 337
Final project: Arabic letters javascript code where the data about the letters
is processed and then passed to the webpage.
**/


(function() {
    'use strict';
	window.onload = function() {
		homepage();
		document.getElementById("home").onclick = homepage;
	};

	/** This function loads all the letters */
	function homepage () {
		document.getElementById("mainpage").innerHTML = "";
		hide();
		let response  = fetching("http://finalprojectarabic.herokuapp.com:process.env.PORT/?mode=all&title=");
		response.then(function(responseText) {
			response  = JSON.parse(responseText);
			
			for (let i = 0; i<response["letters"].length; i++) {

				let number = response["letters"][i]["number"];

				let letter = document.createElement("div");
				let image = document.createElement("img");

				image.src = "letters/"+number+"/letter.jpg";
				

				letter.id = number;

				letter.onclick = fill;
				
				letter.appendChild(image);
				document.getElementById("mainpage").appendChild(letter);	
			}
		});
	}

	/** This function opens the clicked letter */
	function fill() {
		document.getElementById("mainpage").innerHTML = "";
		hide();

		
		let folder = this.id;
		document.getElementById("letter").src = "letters/"+folder+"/letter.jpg";
		document.getElementById("letter").style.visibility = "visible";
		document.getElementById("write").src = "letters/"+folder+"/write.jpg";
		document.getElementById("write").style.visibility = "visible";

		description(folder);
		info(folder);
		comments(folder);
	}

	
	/** This is function adds the info of the letter 
	* @param {String} folder of the letter
	*/
	function info(folder) {
		let textarea = document.createElement("textarea");
		textarea.cols = "50";
		textarea.rows = "30";
		textarea.id = "text"+folder;
		

		let button = document.createElement("button");
		button.id = "button"+folder;
		
		button.onclick = post;
		button.innerHTML = "Submit";

		document.getElementById("comment").appendChild(textarea);
		document.getElementById("comment").appendChild(button);
	}


	/** This is function gets all the info comments of the letter 
	* @param {String} folder of the letter
	*/
	function comments(folder) {
		let section = document.getElementById("information");
		section.innerHTML = "";
		let response  = fetching("http://finalprojectarabic.herokuapp.com:/?mode=info&title="+folder);
		response.then(function(responseText) {
			response  = JSON.parse(responseText);
			
			for (let i = 0; i<response["messages"].length; i++) {
				let comment = document.createElement("p");
				comment.innerHTML = response["messages"][i];
				section.appendChild(comment);		
			}
		});
	}


	/** This is function adds the description of the letter 
	* @param {String} folder of the letter
	*/
	function description(folder) {
		let response  = fetching("http://finalprojectarabic.herokuapp.com:/?mode=description&title="+folder);
		response.then(function(responseText) {
			response  = JSON.parse(responseText);

			document.getElementById("number").innerHTML = 
			"Alphabetical order: "+response["number"];

			document.getElementById("title").innerHTML = 
			"Transliterated: "+response["title"];

			document.getElementById("english").innerHTML = 
			"English equivalent letter: "+response["english"];

			document.getElementById("pronunciation").innerHTML = 
			"Pronunciation: "+ response["pronunciation"];

			document.getElementById("value").innerHTML =
			"Value = " +response["value"];
		});
	}


	/** This is the fetching function */
	function post(){
		let num = this.id.substring(6);
		
		let textarea = "text"+num;

		let text = document.getElementById(textarea).value;

			

		document.getElementById(textarea).value = "";

		const message = {comment: text};

		const fetchOptions = {
				method : 'POST',
				headers : {
					'Accept': 'application/json',
					'Content-Type' : 'application/json'
				},
				body : JSON.stringify(message)
			};

		if (text) {
			//add the comment to the page
			let comment = document.createElement("p");
			comment.innerHTML = text;
			document.getElementById("information").appendChild(comment);

			fetch("http://finalprojectarabic.herokuapp.com:/?mode=post&title="+num, fetchOptions)
				.then(checkStatus)
				.then(function(responseText) {
					console.log(responseText);
				})
				.catch(function(error) {
					console.log(error);
				});
			}
	}


	/** This is the fetching function 
	* @param {String} url to fetch
	* @returns {String} response
	*/
	function fetching (url) {
		return fetch(url)
			.then(checkStatus)
			.catch(function(error) {
				console.log(error);
			});
	}


	/** This is function hides the subpage */
	function hide() {
		document.getElementById("letter").src = "noImage";
		document.getElementById("letter").style.visibility = "hidden";
		document.getElementById("write").src = "noImage";
		document.getElementById("write").style.visibility = "hidden";

		document.getElementById("number").innerHTML = "";
		document.getElementById("title").innerHTML = "";
		document.getElementById("english").innerHTML = "";
		document.getElementById("pronunciation").innerHTML = "";
		document.getElementById("value").innerHTML = "";

		document.getElementById("comment").innerHTML = "";
		document.getElementById("information").innerHTML = "";
	}


	/** This is the check function 
	* @param {String} response to check errors
	* @returns {String} error
	*/
	function checkStatus(response) { 
		if (response.status >= 200 && response.status < 300) {  
			return response.text();
		// special reject message for page not found
		} else if(response.status == 404) {
			return Promise.reject(new Error("sorry we do not have any data"));
		} else {
			return Promise.reject(new Error(response.status+": "+response.statusText)); 
		} 
	}
})();
