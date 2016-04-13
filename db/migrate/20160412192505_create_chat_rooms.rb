class CreateChatRooms < ActiveRecord::Migration
  def change
    create_table :chat_rooms do |t|
      t.string :room_name
      t.integer :last_id
      t.string :last_message

      t.timestamps
    end
  end
end
