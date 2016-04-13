class ChatRoomsController < ApplicationController

    use MessageBus::Rack::Middleware

    def enter

        @user = ChatUser.find_or_create_by(username: params_username)
        @user.update(last_seen: DateTime.now)

        MessageBus.publish '/presence', {enter: @user.username}

        respond_to do |format|
            format.js {
                render json: {users: $online, username: @user.username}
            }
        end

    end

    def leave

        @user = ChatUser.find_by(username: params_username)

        if @user

            @user.update(last_seen: DateTime.now)
            MessageBus.publish '/presence', {leave: @user.username}

        end

    end

    def message
        msg = params_message

        if msg

            MessageBus.publish '/message', msg

            respond_to do |format|
                format.js {
                    render string: "OK"
                }
            end

        end

    end


    private

    def params_username
        params.require(:username)
    end

    def params_message
        data = params.require(:data)
        name = params.require(:username)

        {data: data[0..500], username: name[0..100]}
    end

end
