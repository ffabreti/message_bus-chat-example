# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160412193540) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "chat_rooms", force: true do |t|
    t.string   "room_name"
    t.integer  "last_id"
    t.string   "last_message"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "chat_users", force: true do |t|
    t.string   "username"
    t.datetime "last_seen"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "message_bus", force: true do |t|
    t.text     "channel",                    null: false
    t.text     "value",                      null: false
    t.datetime "added_at", default: "now()", null: false
  end

  add_index "message_bus", ["added_at"], name: "table_added_at_index", using: :btree
  add_index "message_bus", ["channel", "id"], name: "table_channel_id_index", using: :btree

end
