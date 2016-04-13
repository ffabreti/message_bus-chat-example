# see https://github.com/SamSaffron/message_bus/blob/master/examples/chat/chat.rb

require 'message_bus'
require 'message_bus/backends/postgres'


MessageBus.configure(
    backend: :postgres,
    backend_options: {
        user: 'messagebus-chat',
        password: '123456',
        dbname: 'messagebus-chat_development'
    }
)


$online = Hash.new


MessageBus.subscribe "/presence" do |msg|

    if user = msg.data["enter"]
        $online[user] = Time.now
    end
    if user = msg.data["leave"]
        $online.delete user
    end

end

MessageBus.user_id_lookup do |env|

    MessageBus.logger = env['rack.logger']
    name = env["HTTP_X_USERNAME"]
    if name
        unless $online[name]
            # we have received a pooling from a client that is not on our online hash
            # let's tell everyone it's online...
            MessageBus.publish "/presence", {enter: name}
        end
        # ... and register it as online
        $online[name] = Time.now
    end
    name

end

def expire_old_sessions

    $online.each do |name, time|
        if (Time.now - (5*60)) > time
            Rails.logger.warn "forcing leave for #{name} session timed out"
            MessageBus.publish "/presence", {leave: name}
        end
    end
rescue => e
    # need to make $online thread safe
    p e

end

Thread.new do

    while true
        expire_old_sessions
        sleep 1
    end

end