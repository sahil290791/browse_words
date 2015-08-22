class CreateBookmarks < ActiveRecord::Migration
  def change
    create_table :bookmarks do |t|
      t.string :word
      t.text :description
      t.text :audio_url

      t.timestamps
    end
  end
end
