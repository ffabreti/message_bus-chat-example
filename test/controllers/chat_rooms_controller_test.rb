require 'test_helper'

class ChatRoomsControllerTest < ActionController::TestCase
  test "should get enter" do
    get :enter
    assert_response :success
  end

  test "should get leave" do
    get :leave
    assert_response :success
  end

  test "should get message" do
    get :message
    assert_response :success
  end

  test "should get index" do
    get :index
    assert_response :success
  end

end
