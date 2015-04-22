/* Your code starts here */

var app = {};

app.init = function() {

	/*--------------- SHARED FUNCTIONS AND VARS ---------------*/
	var appendNavigation = function(department){
		var navBar = $('<nav></nav>');
			var home = $('<p id="home"><a href="/">home</a></p>');
				if(department !== undefined){
					home.append('<span> > ' + department + '</span>');
				}
			var myCollection = $('<p id="my-collection"><a href="collection.html">My Collection</a></p>');

		$('body').prepend(navBar);
		$(navBar).append(home);
		$(navBar).append(myCollection);

	}

	var getParameterByName = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var appendImages = function(data, container, isHomepage){
		
		data.forEach(function(item, index, array){
			// console.log(item.img_url_web);
			if(isHomepage){
				var link = $('<a href="department.html#' + encodeURIComponent(item.department) + '"></a>');
			}else{
				var link = $('<a href="recommendations.html?main_item_id=' + item.item_id + '"></a>');	
			}
			var image = $('<img class="item" name="' + item.item_id + '" src="' + item.img_url_web + '"/>');
			$(container).append(link);
			$(link).append(image);
		});

		attachEvents();
	}	

	var attachEvents = function(){
		$('.add-bt').off('click').on('click', function(){
			// console.log($(this).attr('name'));

			// Does the user already have a collection?

			// Yes. Let's split it into an array and add one more item
			if(localStorage['collection'] !== undefined){
				// console.log(localStorage['collection'].split(',').length);
				var savedItems = localStorage['collection'].split(',');
				savedItems.push($(this).attr('name'));
				// console.log(savedItems);
				localStorage['collection'] = savedItems;

			// No. Just add this item
			}else{
				localStorage['collection'] = $(this).attr('name');
			}

			// Go back to the previous page
			history.go(-1);
		});
	}
	
	var page = window.location.pathname;


	/*------------------------- PAGES -------------------------*/
	// HOME
	if(page == '/' || page == '/index.html'){

		// console.log('Your code starts here!');
		var loadHome = function(){
			$.get('/home', {}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					// console.log(response);
					appendImages(response, $('#container'), true);
		        }
		    });
		}
		
		appendNavigation();
		loadHome();


	// DEPARTMENT
	}else if(page.indexOf('department.html') > -1){

		var loadDepartment = function(){
			// console.log(location.hash.substring(1));
			$.post('/department', {
				'department': department
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					// console.log(response);
					appendImages(response, $('#container'));
		        }
		    });			
		}

		var department = decodeURIComponent(location.hash.substring(1));		
		appendNavigation(department);
		loadDepartment();
		

	// RECOMMENDATIONS
	}else if(page.indexOf('recommendations.html') > -1){

		var loadRecommendations = function(){
			// console.log(location.hash.substring(1));
			$.post('/recommendations', {
				'main_item': mainItemId,
				'items': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					console.log(response);
					var mainItem = $('<div class="main">' +
										  
										  '<img ' +
										  	'name="' + response['main_item'].item_id + '" ' +
										  	'src="' + response['main_item'].img_url_web + '"' +
										  '/>' +
										  
										  '<br/>' +

										  '<button ' +
										  	'class="add-bt"' +
										  	'name="' + response['main_item'].item_id + '">' +
										  	'Add' + 
										  '</button>' +

									  '</div>');

					var similarToMain = $('<div>' +
													'<hr>' +
													'<h2>Similar to this item</h2>' +
												'</div>');

					var similarToCollection = $('<div>' +
													'<hr>' +
													'<h2>Similar to items in your collection</h2>' +
												'</div>');

					$('#container').append(mainItem);
					$('#container').append(similarToMain);
					$('#container').append(similarToCollection);

					appendImages(response['similar_to_main'], similarToMain);
					appendImages(response['similar_to_collection'], similarToCollection);
		        }
		    });			
		}

		var mainItemId = getParameterByName('main_item_id');
		console.log(mainItemId);
		appendNavigation();
		loadRecommendations();


	// COLLECTION
	}else if(page.indexOf('collection.html') > -1){

		var loadCollection = function(){
			// console.log(location.hash.substring(1));
			$.post('/collection', {
				'items': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					// console.log(response);
					appendImages(response);
		        }
		    });			
		}

		appendNavigation();
		loadCollection();
	}	


	
};

app.init();