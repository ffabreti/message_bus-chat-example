class CreateChatUsers < ActiveRecord::Migration
  def change
    create_table :chat_users do |t|
      t.string :username
      t.datetime :last_seen

      t.timestamps
    end
  end
end
