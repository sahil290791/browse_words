class BrowseWordsController < ApplicationController


  def index

  end

  def bookmark_word
  	word = params[:word]
  	description = params[:description]
  	url = params[:url]
  	word_in_db = Bookmark.find_by_word(word) if word

  	if word and !word_in_db
  		bookmark = Bookmark.new
  		bookmark.word = word
  		bookmark.description = description
  		bookmark.audio_url = url
  		bookmark.save
  		render text:"Bookmarked" and return
  	elsif word_in_db
  		render text:"Already Bookmarked" and return
  	else
  		render text:"Not Bookmarked" and return
  	end
  end

  def check_bookmark
  	word = params[:word]
  	word_in_db = Bookmark.find_by_word(word) if word
  	if word and !word_in_db
  		render text:"Not Bookmarked" and return
  	elsif word_in_db
  		render text:"Already Bookmarked" and return
  	else
  		render text:"Not Bookmarked" and return
  	end
  end	

  def bookmark_history
  	bookmarks = Bookmark.all
  	render text:bookmarks.as_json(:only => [:word,:id, :audio_url, :description]).to_json
  end

  def delete_word
  	word = Bookmark.find(params[:id])
  	if word
  		word.destroy 
  		render text:"Deleted"
  	else
  		render text:"Not Deleted"
  	end	
  end

   def delete_all
  	words = Bookmark.all
  	if words
  		words.each {|word| word.destroy}
  		render text:"Deleted"
  	else
  		render text:"Not Deleted"
  	end	
  end

  def download_bookmarks
  	@bookmarks = Bookmark.all
    #espond_to do |format|
      #format.pdf do
        render pdf: "bookmark_history", disposition: 'attachment'
      #end
    #end
  end

end
