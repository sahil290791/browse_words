  $(document).ready(function(){
	  	
	    var field = "A", request;
	    
	    $('.navLinks').on('click',function(){
	      field = $(this).find('input').attr('id');
	      if (field.length >= 1){
	        if(request !== undefined){
	            request.abort(); 
	          }
	          getResult();
	      }
	    });

	    setTimeout(getResult(),100);

	    function getResult(){

	      request = $.ajax({
	        url: 'https://letsventure.0x10.info/api/dictionary.php?type=json&query='+field,
	        method: 'get',
	        dataType: 'json',
	        contentType: 'text/plain',
	        crossDomain: true,
	        success: function(data){
	          $('.searchResultContainer').fadeOut().remove();
	          showResults(data);
	          $('.selectedWord').addClass('hidden');
	          $('.showResults').removeClass('hidden');
	        },
	        error: function(data){
	        	$('.showResults').addClass('hidden');
	        }
	      });

		$.ajax({
	        url: 'https://letsventure.0x10.info/api/dictionary.php?type=json&query=api_hits',
	        method: 'get',
	        dataType: 'json',
	        contentType: 'text/plain',
	        crossDomain: true,
	        success: function(data){
	        	$('#hitCount').html(data["api_hits"]);
	        },
	        error: function(data){
	        }
	      });
	    }

	    function showResults(data){
	      var result ="";
	      var results = data;//JSON.parse(data);
	      
	      if (results.length > 0 ){
	      	$('.showResults .help-block').html('(Showing '+results.length+' results)');
	        $.each(results, function(i, obj) {
	        	// console.log(obj["word"]);
	          result += "<li class='list-group-item text-left'>"+ "<a class='word' data-url='"+obj['audio_url']+"' href='#"+obj['word']+"'>"+ obj["word"]+ "</a><input type='hidden' value='"+obj['description']+"' /></li>"; 
	        });
	      }
	      else if(results.length === 0){
	        result = "<li class='list-group-item'><span class='text-muted' >No results found.</span></li>"; 
	      }
	      var list = $("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 ccpPost searchResultContainer paddingReset'><ul id='searchResult' class='searchResult paddingReset list-group'></ul></div>");
	      $('.wordsList').append(list);
	      $('.searchResult').append(result);
	      $('#letterSearch').fastLiveFilter('#searchResult');
	    }

	    $(document).on('click','a.word',function(){
	    	var word = $(this).text();
	    	var description = $(this).closest('li').find('input').val();
	    	var audioUrl = $(this).attr('data-url');
	    	$('.wordTitle').html(word);
	    	$('.wordDescription').html(description);
	    	$('audio').attr('src',audioUrl);
	    	$('.selectedWord').removeClass('hidden');
	    	$('.bookmarked').addClass('bookmark');
	    	$('.bookmark').removeClass('bookmarked');
	    	$('.bookmark i').addClass('fa-star-o').removeClass('fa-star');
	    	$('.social-share-button').attr('data-title',word);
	    	check_if_bookmarked(word);
	    });

	    $('.audio').on('click', function(){
	    	var player= document.getElementById('audio');
	    	player.play();
	    });

	    $('.bookmarks').click(function () {
	       $(this).fadeOut(300);
	       $()
	    });

	    $('.bookmark').click(function(){
	    	var word = $('.wordTitle').html();
	    	var description = $('.wordDescription').html();
	    	var url = $('audio').attr('src');
	    	var bookmark = $(this);
			$.ajax({
			  	url: '/browse_words/bookmark_word?word='+word+'&description='+description+'&url='+url,
		        method: 'get',
		        dataType: 'text',
		        contentType: 'text/plain',
		        crossDomain: true,
		        success: function(data){
		        	if (data === "Bookmarked"){
			         	bookmark.find('i').removeClass('fa-star-o').addClass('fa-star').parent().removeClass('bookmark').addClass('bookmarked');
			         	notification("Word is succesfully bookmarked","success");
			         }
			         else if(data === "Already Bookmarked"){
			         	bookmark.find('i').removeClass('fa-star-o').addClass('fa-star').parent().removeClass('bookmark').addClass('bookmarked');
			         	notification("Word is already bookmarked","warning");	
			         }
			         else{
			         	notification("Error occured during bookmarking. Please try again","danger");		
			         }
			         bookmark_count();
		        },
		        error: function(data){
		        	notification("Word could not be bookmarked","danger");
		        }
		      });	    	
	    });

	function check_if_bookmarked(word){
		$.ajax({
		  	url: '/browse_words/check_bookmark?word='+word,
	        method: 'get',
	        dataType: 'text',
	        contentType: 'text/plain',
	        crossDomain: true,
	        success: function(data){
	        	if (data === "Not Bookmarked"){

		         }
		         else if(data === "Already Bookmarked"){
		         	$('.bookmark').find('i').removeClass('fa-star-o').addClass('fa-star').parent().removeClass('bookmark').addClass('bookmarked');	
		         }
		         bookmark_count();
	        },
	        error: function(data){
	        }
	      });	
	}

		function notification(msg,type){
		  var alert = $('<div class="alert notification-alert '+type+'-notification"></div>');
		  $('body').append(alert);
		  alert.html(msg);
		  setTimeout(function(){
		    $('.notification-alert').fadeOut().html('');
		  },3000);
		}

		$('#history').on('click', function(){
			$.ajax({
		        url: '/browse_words/bookmark_history',
		        method: 'get',
		        dataType: 'json',
		        contentType: 'text/plain',
		        crossDomain: true,
		        success: function(data){
		        	var result = data;//$.parseJSON(data);
		        	var list = "";
		        	$.each(result, function(i, obj){
		        		list += "<li class='bookmarked-word list-group-item'><a class='showWord' data-url='"+obj["audio_url"]+"' >"+obj["word"]+"</a><input type='hidden' value='"+obj["description"]+"'/><a class='pull-right delete' data-id='"+obj["id"]+"' data-remote='true'><i class='fa fa-trash-o'></i></a></li>";
		        	});
		        	var content = $("<ul class='list-group'></ul>");
		        	content.append(list);
		        	if (list.length === 0){
		        		$('#bookmarkHistory .modal-body').html('<p>Loading..</p>').html("<li class='list-group-item'>No word bookmarked yet.</li>");
		        	}
		        	else{
		        		$('#bookmarkHistory .modal-body').html('<p>Loading..</p>').html(content);	
		        	}
		        	bookmark_count();
		        },
		        error: function(data){
		        }
		      });
		});

		$(document).on('click','.delete', function(e){
			e.preventDefault();
			var id = $(this).attr('data-id');
			$.ajax({
		        url: '/browse_words/'+id+'/delete_word',
		        method: 'get',
		        contentType: 'text/plain',
		        success: function(data){
		        	if(data === "Deleted"){
		        		notification('Word removed from bookmark list.','success');
		        		$('a.delete[data-id="'+id+'"]').closest('li').remove();
		        	}
		        	else{
		        		notification('Word not found in your bookmark list.','warning');
		        	}
		   			
		        },
		        error: function(data){
		        }
		      });
		});

		$(document).on('click','.deleteAll', function(e){
			e.preventDefault();
			$.ajax({
		        url: '/browse_words/delete_all',
		        method: 'get',
		        contentType: 'text/plain',
		        success: function(data){
		        	if(data === "Deleted"){
		        		notification('All Bookmarks removed from the bookmark list.','success');
		        		$('.modal-body').html('');
		        	}
		        	else{
		        		notification('Bookmarks could not be removed.','danger');
		        	}
		   			
		        },
		        error: function(data){
		        }
		      });
		});

		$(document).on('click', '.bookmarked-word a.showWord', function(){
			var word = $(this).html();
			var url = $(this).attr('data-url');
			var description = $(this).closest('li').find('input').val();
			$('.wordTitle').html(word);
	    	$('.wordDescription').html(description);
	    	$('audio').attr('src',url);
	    	$('.selectedWord').removeClass('hidden');
	    	$('.bookmarked').addClass('bookmark');
	    	$('.bookmark').removeClass('bookmarked');
	    	$('.bookmark i').addClass('fa-star-o').removeClass('fa-star');
	    	$('#history').trigger('click');
	    	$('.social-share-button').attr('data-title',word);
	    	check_if_bookmarked(word);
		});

		function bookmark_count(){
		$.ajax({
	        url: '/browse_words/bookmark_history',
	        method: 'get',
	        dataType: 'json',
	        contentType: 'text/plain',
	        crossDomain: true,
	        success: function(data){
	        	var result = data;//$.parseJSON(data);
	        	$('.siteInfo #bookmarkCount').html(result.length);
	        },
	        error: function(data){
	        }
	      });
		}
		
		new ShareButton({
		  networks: {
		    facebook: {
		      app_id: "abc123"
		    }
		  }
		});
		
		$('.sb-social ul li:nth-child(2) a').html('<i style="position: relative; color: rgb(255, 255, 255); top: 12px;" class="fa fa-twitter"></i>');
		$('.sb-social ul li:nth-child(3) a').html('<i style="position: relative; color: rgb(255, 255, 255); top: 12px;" class="fa fa-facebook"></i>');
		$('.sb-social ul li:nth-child(5) a').html('<i style="position: relative; color: rgb(255, 255, 255); top: 12px;" class="fa fa-google-plus"></i>');
		$('.sb-social ul li:nth-child(7) a').html('<i style="position: relative; color: rgb(255, 255, 255); top: 12px;" class="fa fa-linkedin"></i>');
		$('.sb-social ul li:nth-child(1),.sb-social ul li:nth-child(4), .sb-social ul li:nth-child(6), .sb-social ul li:nth-child(8)').remove();

	  });